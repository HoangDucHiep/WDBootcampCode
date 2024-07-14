import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts });
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.get("/post/:id", (req, res) => { 
    let id = req.params.id;
    let post = posts.find((post) => post.id === id);
    res.render("post.ejs", { post: post });
})

app.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    posts = posts.filter((post) => post.id !== id);
    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    res.render("edit.ejs", { id: req.params.id });
});

app.post("/submit-edit/:id", (req, res) => {
    let id = req.params.id;
    let newTitle = req.body.title;
    let newContent = req.body.content;
    let post = posts.find((post) => post.id === id);
    post.title = newTitle;
    post.content = newContent;
    res.redirect("/");
});

app.post("/submit", (req, res) => {
    let Title = req.body.title;
    let Content = req.body.content;
    let Id = generateRandomId();
    posts.push({ title: Title, content: Content, id: Id });
    res.redirect("/");
});

function generateRandomId() {
    // Lấy timestamp hiện tại
    const timestamp = Date.now().toString(36); // Chuyển đổi sang base 36 để ngắn gọn hơn
    // Tạo một số ngẫu nhiên, chuyển đổi sang base 36 và lấy 5 ký tự cuối
    const randomPart = Math.random().toString(36).substr(2, 5);
    // Kết hợp timestamp và phần ngẫu nhiên để tạo ID
    return `${timestamp}-${randomPart}`;
}

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});
