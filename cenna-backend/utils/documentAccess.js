import { cloudinary } from "../config/cloudinary.js";

const SIGNED_URL_LIFETIME_SECONDS = 10 * 60; // 10 minutes

// Values stored before this migration are local paths like
// "/uploads/admission/xyz.jpg" — never signed, returned as-is so existing
// records keep rendering during the transition (see Tier 4 report: no
// migration script was run against them).
const isLegacyLocalPath = (value) =>
  typeof value === "string" && value.startsWith("/uploads/");

const isUsableAsIs = (value) =>
  !value || isLegacyLocalPath(value) || value.startsWith("http");

// Turns a stored value (either a legacy local path/URL, or a Cloudinary
// public_id saved under `type: "authenticated"`) into something a browser
// can actually load right now. Called only from admin-only endpoints — a
// fresh signature is minted per response and expires in 10 minutes, so a
// leaked/cached link can't be replayed indefinitely.
export const resolveSignedDocumentUrl = (storedValue, resourceType = "image") => {
  if (isUsableAsIs(storedValue)) {
    return storedValue;
  }

  return cloudinary.url(storedValue, {
    type: "authenticated",
    sign_url: true,
    resource_type: resourceType,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + SIGNED_URL_LIFETIME_SECONDS,
  });
};

// Parses a standard "upload"-type Cloudinary delivery URL —
// https://res.cloudinary.com/<cloud>/image/upload/v<version>/<folder>/<id>.<ext>
// — back into the "<folder>/<id>" public_id Cloudinary's own APIs need.
// Only ever used to clean up a REPLACED avatar/profile image; returns null
// for anything that isn't a recognizable Cloudinary "upload" URL (a legacy
// local "/uploads/..." path, most notably), so callers can skip cleanup
// for those instead of attempting to delete something that was never there.
export const extractCloudinaryPublicId = (url) => {
  if (typeof url !== "string") return null;

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);

  return match ? match[1] : null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Best-effort cleanup of a just-uploaded Cloudinary asset when the
// surrounding database write fails — never lets a cleanup failure mask the
// original error the caller is already handling.
//
// Retries on a `{result: "not found"}` response, not just a thrown error:
// verified empirically (Tier 4 testing) that calling destroy() concurrently
// with several other destroy() calls immediately after upload can spuriously
// report "not found" for an asset that unquestionably exists — a brief
// read-after-write consistency window on Cloudinary's side, not a bug in the
// public_id or request. A genuinely-missing asset just costs a couple of
// fast, harmless extra round trips before this gives up.
// `deliveryType` must match how the asset was actually uploaded — "upload"
// (the Cloudinary default, used for avatars/gallery/news images) or
// "authenticated" (admission documents, job-application CVs). Passing the
// wrong one doesn't error, it just makes Cloudinary report the asset "not
// found" under the type being asked for while it keeps existing, unnoticed,
// under the type it was actually stored as — verified empirically (Tier 4
// testing) against a live avatar-replacement leak before this parameter
// existed, when every caller was hardcoded to "authenticated".
export const destroyUploadedAsset = async (publicId, resourceType = "image", deliveryType = "upload") => {
  if (!publicId) return;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: deliveryType,
        invalidate: true,
      });

      if (result.result === "ok" || (result.result === "not found" && attempt === 3)) {
        return;
      }
    } catch (err) {
      if (attempt === 3) {
        console.error(
          `[destroyUploadedAsset] Failed to clean up ${publicId}:`,
          err.message,
        );
        return;
      }
    }

    await sleep(400 * attempt);
  }
};
