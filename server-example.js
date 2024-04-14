const express = require('express');
const bodyParser = require("body-parser");
const jsdom = require("jsdom");
const app = express();
const hostname = '127.0.0.1';
const port = 8999;
const host = hostname + ':' + port;
const crypto = require('crypto');

// app.use(bodyParser.urlencoded({extended: false}));
//增加请求体限制
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));


const options = {
    runScripts: 'dangerously',
    resources: "usable",
    pretendToBeVisual: true,
    includeNodeLocations: true,
    beforeParse(window) {
        window.crypto = crypto;
        window.matchMedia = window.matchMedia || function() {
            return {
                matches: false,
                addListener: function() {},
                removeListener: function() {}
            };
        };
    }
};

const {JSDOM} = jsdom;
const {window} = new JSDOM(`
<!DOCTYPE html>
<div id="editorjs"></div>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.0.4/dist/bundle.js"></script>-->
<script src="https://cdn.jsdelivr.net/npm/@editorjs/table@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/link@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/embed@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/inline-code@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/warning@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/code@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/marker@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/underline@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/raw@latest"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/@editorjs/image@latest"></script>-->
<script src="https://cdn.jsdelivr.net/npm/@editorjs/simple-image@latest"></script>
<script>

    
    const editor = new EditorJS({
            holder: 'editorjs',
            tools: {
              header: Header,
              image: SimpleImage,
              checklist:Checklist,
              list: List,
              raw: RawTool,
              quote: Quote,
              Code: CodeTool,
              warning: Warning,
              Marker: Marker,
              delimiter:Delimiter,
              underline:Underline,
              paragraph:Paragraph,
              inlineCode:InlineCode,
              table: Table
            }
    })

    let me = this
    editor.isReady.then(()=>{
        me.editor = editor
    })

</script>`, options);

window.blocks = null

app.post('/html2blocks', function (req, res) {
        if (window.editor) {
        if (req.body.html) {
            window.editor.blocks.renderFromHTML(req.body.html);
            window.editor.save().then(data => {
                console.log(data)
                res.end(JSON.stringify(data))
            })
        } else {
            // res.end({code: -5, data: 'param error'})
            res.end(JSON.stringify({code: -5, data: 'param error'}));  // 这里也要使用 JSON.stringify()
        }
    } else {
        // res.end({code: -7, data: 'editor init failed'})
        res.end(JSON.stringify({code: -7, data: 'editor init failed'}));  // 同上
    }
})


app.listen(port, hostname, function () {

    console.log(`server run at http://${host}`);

});

//git 地址
//Is there any library convert html to block of editorjs, or convert block to html #1232