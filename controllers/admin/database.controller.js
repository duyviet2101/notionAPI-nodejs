const TestReading = require('../../models/testsReading.js')
const requestNotion = require('../../config/notion.js')
const databaseQuery = require('../../helpers/databaseQuery.js')



//![POST] /admin/databases/transfer-notion-2-mongo/tests-reading-ielts
module.exports.transferDataReadingIelst = async (req, res, next) => {
    try {
        const testsDatabaseId = 'ba74aa7d76ef4616aa027406cedb7b69'
        const testIds = req.body.testIds;

        //! get tests
        const tests = await Promise.all(testIds.map(async testId => {
            const test = {};
            var testRaw = (await databaseQuery(testsDatabaseId, {
                filter: {
                    property: 'test_id',
                    number: {
                        equals: testId    
                    }
                }
            })).data[0].properties

            test._id = testRaw.test_id.unique_id.prefix + '-' + testRaw.test_id.unique_id.number;
            test.testReadingTitle = testRaw.test_title.title[0].plain_text;
            
            //!get passages
            const passagesRaw = (await databaseQuery('34c3dca9c7fe4c8cb1b3acf37b80986f', {
                filter: {
                    property: 'test_id',
                    rollup: {
                        any: {
                            number: {
                                equals: testId
                            }
                        }
                    }
                }
            })).data

            const passages = await Promise.all(passagesRaw.map(async item => {
                const passage = {};
                passage._id = item.properties.passage_id.unique_id.prefix + '-' + item.properties.passage_id.unique_id.number;
                passage.passageTitle = item.properties.passage_title.title[0].plain_text;
                passage.passageContent = item.content.results[0].paragraph.rich_text[0].plain_text;

                //! get setsQuestion in a passage
                const passageId = item.properties.passage_id.unique_id.number;
                const setsQuestionsRaw = (await databaseQuery('308e7b50317b4e9081240d6be9d7b20b', {
                        filter: {
                            property: "passage_id",
                            rollup: {
                                any:{
                                    number: {
                                        equals: passageId
                                    }
                                }
                            }
                        },
                        sorts: [
                            {
                                property: "Order",
                                direction: "ascending"
                            }
                        ]
                })).data
                const setsQuestions = await Promise.all(setsQuestionsRaw.map(async item => {
                    const setQuestions = {};

                    setQuestions._id = item.properties.question_id.unique_id.prefix + '-' + item.properties.question_id.unique_id.number;
                    setQuestions.setType = item.properties.question_type.select.name;
                    setQuestions.setOrder = item.properties.Order.number;
                    setQuestions.setTitle = item.content.results[0].paragraph.rich_text[0].plain_text;
                    
                    //! get questionAndKey of a set question
                    const questionsAndKeysId = item.content.results[1].id;
                    const questionsAndKeysRaw = await requestNotion({
                        method: 'GET',
                        url: `/blocks/${questionsAndKeysId}/children?page_size=100`
                    }).then(response => response.data.results.map((item => item.table_row.cells)))

                    const questionsAndKeys = (questionsAndKeysRaw.filter((item, index) => index > 0))
                        .map((item, index) => {
                                const questionAndKey = {};
                                questionAndKey.questionOrder = index + 1;
                                questionAndKey.questionTitle = item[0][0].plain_text;
                                questionAndKey.optionsAndKey = {
                                    options: item[1][0] ? item[1][0].plain_text : null,
                                    key: item[2][0].plain_text
                                }
                                return questionAndKey;
                        })

                    setQuestions.questionsAndKeys = questionsAndKeys;

                    return setQuestions;
                }))

                passage.setsQuestions = setsQuestions;

                return passage;
            }))

            test.passages = passages;

            //! lưu test vào mongodb
            const newTest = new TestReading(test);
            newTest.save();

            return test;
        }))
        res.send({
            message: `add tests success: ${testIds}`
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
    
}
