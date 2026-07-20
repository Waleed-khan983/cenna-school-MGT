import PDFDocument from "pdfkit";

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

const drawHeading = (doc, text) => {
    doc
        .moveDown()
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(text, {
            align: "center",
        });

    doc.moveDown();
};

const drawSectionHeading = (doc, text) => {
    doc
        .moveDown()
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(text);

    doc.moveDown(0.4);
};

const drawLine = (doc) => {
    doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

    doc.moveDown();
};

const ensurePage = (doc) => {
    if (doc.y > 720) {
        doc.addPage();
    }
};

/*
|--------------------------------------------------------------------------
| Generate Evaluation PDF
|--------------------------------------------------------------------------
*/

export const generateEvaluationPdf = (
    template,
    res,
    isFilled = false,
    response = null
) => {
    const doc = new PDFDocument({
        size: "A4",
        margin: 40,
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `inline; filename="${template.title}.pdf"`
    );

    doc.pipe(res);

    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    drawHeading(doc, template.title);

    if (template.description) {
        doc
            .font("Helvetica")
            .fontSize(10)
            .text(template.description, {
                align: "center",
            });

        doc.moveDown();
    }

    drawLine(doc);

    /*
    |--------------------------------------------------------------------------
    | Observer / Teacher Information
    |--------------------------------------------------------------------------
    */

    if (
        template.observerFields &&
        template.observerFields.length
    ) {
        doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Information");

        doc.moveDown(0.5);

        template.observerFields.forEach((field) => {
            ensurePage(doc);

            let value = "";

            if (
                isFilled &&
                response &&
                response.metadata &&
                response.metadata[field]
            ) {
                value = response.metadata[field];
            }

            doc
                .font("Helvetica")
                .fontSize(11)
                .text(
                    `${field}: ${value ||
                    "________________________________________"
                    }`
                );

            doc.moveDown(0.3);
        });

        drawLine(doc);
    }

    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    template.sections.forEach((section, sectionIndex) => {
        ensurePage(doc);

        drawSectionHeading(
            doc,
            `${sectionIndex + 1}. ${section.title}`
        );

        if (section.description) {
            doc
                .font("Helvetica")
                .fontSize(10)
                .text(section.description);

            doc.moveDown();
        }

        section.questions.forEach(
            (question, questionIndex) => {
                ensurePage(doc);

                doc
                    .font("Helvetica-Bold")
                    .fontSize(11)
                    .text(
                        `${questionIndex + 1}. ${question.question
                        }`
                    );

                doc.moveDown(0.3);

                /*
                |--------------------------------------------------------------------------
                | MCQ
                |--------------------------------------------------------------------------
                */

                if (question.type === "mcq") {
                    const submittedAnswer =
                        isFilled &&
                            response
                            ? response.answers.find(
                                (answer) =>
                                    answer.sectionId.toString() ===
                                    section._id.toString() &&
                                    answer.questionId.toString() ===
                                    question._id.toString()
                            )
                            : null;

                    const optionText =
                        question.options
                            .map((option) => {
                                const checked =
                                    submittedAnswer &&
                                    String(
                                        submittedAnswer.answer
                                    ) === option.text;

                                return `${checked
                                        ? "(✓)"
                                        : "( )"
                                    } ${option.text}`;
                            })
                            .join("     ");

                    doc
                        .font("Helvetica")
                        .fontSize(10)
                        .text(optionText);

                    doc.moveDown();
                }

                /*
                |--------------------------------------------------------------------------
                | Short Answer
                |--------------------------------------------------------------------------
                */

                if (
                    question.type ===
                    "short-answer"
                ) {
                    const submittedAnswer =
                        isFilled &&
                            response
                            ? response.answers.find(
                                (answer) =>
                                    answer.sectionId.toString() ===
                                    section._id.toString() &&
                                    answer.questionId.toString() ===
                                    question._id.toString()
                            )
                            : null;

                    if (submittedAnswer) {
                        doc
                            .font("Helvetica")
                            .fontSize(10)
                            .text(
                                submittedAnswer.answer
                            );
                    } else {
                        doc.text(
                            "________________________________________________________"
                        );

                        doc.text(
                            "________________________________________________________"
                        );
                    }

                    doc.moveDown();
                }
            }
        );

        drawLine(doc);
    });
    /*
|--------------------------------------------------------------------------
| Scoring Summary
|--------------------------------------------------------------------------
*/

    if (
        template.pdf &&
        template.pdf.showScoringSummary &&
        template.summary &&
        template.summary.length
    ) {
        ensurePage(doc);

        drawHeading(doc, "Scoring Summary");

        template.summary.forEach((item) => {
            doc
                .font("Helvetica")
                .fontSize(11)
                .text(`• ${item}`);
        });

        doc.moveDown();
    }

    /*
    |--------------------------------------------------------------------------
    | Rating Scale
    |--------------------------------------------------------------------------
    */

    if (
        template.pdf &&
        template.pdf.showRatingTable &&
        template.ratingScale &&
        template.ratingScale.length
    ) {
        ensurePage(doc);

        drawHeading(doc, "Performance Rating");

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .text(
                "Level",
                50,
                doc.y,
                {
                    continued: true,
                    width: 140,
                }
            )
            .text(
                "Percentage",
                {
                    continued: true,
                    width: 140,
                }
            )
            .text("Rating");

        doc.moveDown(0.5);

        template.ratingScale.forEach((item) => {
            ensurePage(doc);

            doc
                .font("Helvetica")
                .fontSize(10)
                .text(
                    item.level,
                    50,
                    doc.y,
                    {
                        continued: true,
                        width: 140,
                    }
                )
                .text(
                    item.percentage,
                    {
                        continued: true,
                        width: 140,
                    }
                )
                .text(item.rating);

            doc.moveDown(0.4);
        });

        drawLine(doc);
    }

    /*
    |--------------------------------------------------------------------------
    | Signatures
    |--------------------------------------------------------------------------
    */

    if (
        template.pdf &&
        template.pdf.showSignatures &&
        template.signatures &&
        template.signatures.length
    ) {
        ensurePage(doc);

        drawHeading(doc, "Signatures");

        template.signatures.forEach((signature) => {
            doc
                .font("Helvetica")
                .fontSize(11)
                .text(
                    `${signature}: ____________________________________`
                );

            doc.moveDown(1);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    ensurePage(doc);

    doc.moveDown(2);

    drawLine(doc);

    doc
        .font("Helvetica-Oblique")
        .fontSize(9)
        .fillColor("gray")
        .text(
            "Generated by CENNA School Management System",
            {
                align: "center",
            }
        );

    doc.end();
};