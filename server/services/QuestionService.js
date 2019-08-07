import mongoose from 'mongoose'

let schema = new mongoose.Schema({
    prompt: { type: String, required: true },
    options: [{ type: Object }],
    correct: [{ type: Object }],
    type: { type: String, enum: ["TrueFalse", "Match", "OpenEnded", "FillInTheBlank", "MultipleChoice"], required: true },
    rationale: { type: String },
    categories: [{ type: String, enum: ["HTML", "CSS", "Style and Design", "Built In Methods", "SOLID", "OOP", "C#", "Scrum", "Javascript", "Design Patterns"] }]
}, { timestamps: true })




export default class QuestionService {

    gradeQuestion(answer, question) {
        let out = {}
        switch (question.type) {

            case "TrueFalse":
                out = this.gradeTrueFalse(answer, question)
                break;
            case "MultipleChoice":
                out = this.gradeMultipleChoice(answer, question)
                break;
            case "FillInTheBlank":
                out = this.gradeFillInTheBlank(answer, question)
                break;
            case "Match":
                out = this.gradeMatch(answer, question)
                break;
            case "OpenEnded":
                out = this.gradeOpenEnded(answer, question)
                break;
            default: "No Function Here"
                break;
        }
        return out
    }

    grade(didPass, question) {
        let grade = { passed: didPass, correct: question.correct, rationale: question.rationale, type: question.type }
        return grade
    }

    gradeTrueFalse(answer, question) {
        let correct = question.correct[0]

        if (answer.submission.value == correct.value) {
            // grade = this.grade(true, question)
            return this.grade(true, question)
        } else {

            return this.grade(false, question)
        }
    }
    gradeMultipleChoice(answer, question) {

        if (answer.submission.length != question.correct.length) {
            return this.grade(false, question)
        }
        let correctStudentAnswers = answer.submission.filter(x => question.correct.find(y => y.value == x.value))
        if (correctStudentAnswers.length !== question.correct.length) {
            return this.grade(false, question)

        }
        else return this.grade(false, question)
    }
    gradeFillInTheBlank(answer, question) {
        question.correct.forEach(x => {
            let y = answer.submission.find(z => z.value == x.value)
            if (!y) { return this.grade(false, question) }
            if (y.definition !== x.definition) { return this.grade(false, question) }
        })
        return this.grade(true, question)
    }
    gradeMatch(answer, question) {


        for (let x = 0; x < question.correct.length; x++) {
            let correct = question.correct[x]
            let y = answer.submission.find(z => z.value == correct.value)
            if (!y) { return this.grade(false, question) }
            if (y.definition !== correct.definition) { return this.grade(false, question) }
        }

        return this.grade(true, question)
    }

    gradeOpenEnded(answer, question) {
        return question.rationale
    }

    get repository() {
        return mongoose.model("Question", schema)
    }
}