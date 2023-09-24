const requestNotion = require('../config/notion');

// [POST] /databases/:id/query
module.exports.queryDatabase = async (req, res) => {
    const databaseId = req.params.databaseId;
    try {
        const database = {};

        //! get thông tin của các pages trong database, vì notion chỉ giới hạn một lần response về max là 100 phần tử,
        //! nên cần phải thiết kế để lấy về đủ tất cả phần tử nếu có nhiều hơn 100
        //? https://developers.notion.com/reference/pagination#:~:text=For%20endpoints%20using%20the%20HTTP%20POST%20method%2C%20these%20parameters%20are%20accepted%20in%20the%20request%20body.
            //*Khởi tạo một danh sách chứa tất cả pages
        var allPages = [];
        
            //*đặt cursor ban đầu là null để bắt đầu từ page đầu tiên
        var startCursor = null;
        while (true) {
            if (startCursor) {
                req.body.start_cursor = startCursor;
            }

            const responsePages = await requestNotion({
                method: 'POST',
                url: `/databases/${databaseId}/query`,
                data: req.body
            }).then (respone => respone.data)

            database.object = responsePages.object;

            allPages = [...allPages, ...responsePages.results];
                //* Nếu thuộc tính has_more trong response = true thì gán lại vào startCursor để tiếp tục query dữ liệu còn lại
                //*nếu không thì break
            if (responsePages.has_more == true) {
                startCursor = responsePages.next_cursor;
                // console.log(startCursor);
            } else {
                break;
            }
        }

        database.results = allPages;
        res.send(database)
    } catch (error) {
        // console.log(">>>>>>>>>>>>>>>",error.code)
        if(error.respone){
            // console.log('response>>>',error.respone)
            res.send({error: error.respone.data})
        } else
        if (error.request) {
            // console.log('request>>>',error.request.data)
            res.send({error: error.code})
        } else
        if (error.message) {
            // console.log('message>>>',error.message)
            res.send({error: error.message})
        } else
        res.send({error: "UNKNOWN ERROR"})
    }

}



module.exports.queryDatabaseMix = async (req, res) => {
    const databaseId = req.params.databaseId;
    try {
        //! get thông tin của database
        var responseDatabase = await requestNotion({
            method: 'GET',
            url: `/databases/${databaseId}`,
        }).then((responseDatabase) => responseDatabase.data)
        
        const database = {
            object: responseDatabase.object,
            id: responseDatabase.id,
            created_time: responseDatabase.created_time,
            last_edited_time: responseDatabase.last_edited_time,
            title: responseDatabase.title[0].plain_text,
            description: responseDatabase.description,
            properties: responseDatabase.properties,
            parent: responseDatabase.parent
        }

        //! get thông tin của các pages trong database, vì notion chỉ giới hạn một lần response về max là 100 phần tử,
        //! nên cần phải thiết kế để lấy về đủ tất cả phần tử nếu có nhiều hơn 100
        //? https://developers.notion.com/reference/pagination#:~:text=For%20endpoints%20using%20the%20HTTP%20POST%20method%2C%20these%20parameters%20are%20accepted%20in%20the%20request%20body.
            //*Khởi tạo một danh sách chứa tất cả pages
        var allPages = [];
        
            //*đặt cursor ban đầu là null để bắt đầu từ page đầu tiên
        var startCursor = null;
        while (true) {
            if (startCursor) {
                req.body.start_cursor = startCursor;
            }

            const responsePages = await requestNotion({
                method: 'POST',
                url: `/databases/${databaseId}/query`,
                data: req.body
            }).then (respone => respone.data)

            allPages = [...allPages, ...responsePages.results];
                //* Nếu thuộc tính has_more trong response = true thì gán lại vào startCursor để tiếp tục query dữ liệu còn lại
                //*nếu không thì break
            if (responsePages.has_more == true) {
                startCursor = responsePages.next_cursor;
                // console.log(startCursor);
            } else {
                break;
            }
            
        }

        //! get blocks in page
        const blocks =  await Promise.all(allPages.map(async (page, index) => {
            const content = await requestNotion({
                method: 'GET',
                url: `/blocks/${page.id}/children?page_size=100`
            }).then(response => response.data)
            return {
                object: page.object,
                id: page.id,
                parent: page.parent,
                properties: page.properties,
                content: content
            }
        }));
        database.data = blocks;
        res.send(database)
    } catch (error) {
        // console.log(">>>>>>>>>>>>>>>",error.code)
        if(error.respone){
            // console.log('response>>>',error.respone)
            res.send({error: error.respone.data})
        } else
        if (error.request) {
            // console.log('request>>>',error.request.data)
            res.send({error: error.code})
        } else
        if (error.message) {
            // console.log('message>>>',error.message)
            res.send({error: error.message})
        } else
        res.send({error: "UNKNOWN ERROR"})
    }

}