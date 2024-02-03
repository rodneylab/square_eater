use askama::Template;
use std::{fs::File, include_bytes, io::Write};

#[derive(Template)]
#[template(path = "index.html")]
struct HtmlTemplate<'a> {
    css: &'a str,
}

fn main() {
    println!("cargo:rerun-if-changed=template/index.html");
    println!("cargo:rerun-if-changed=public/style/styles.css");

    let destination_path = "./public/index.html";
    let mut file = File::create(destination_path).unwrap();

    let css = &String::from_utf8_lossy(include_bytes!("./public/style/styles.css"));
    let html = HtmlTemplate { css };
    let html_string = html.render().unwrap();
    file.write_all(html_string.as_bytes()).unwrap()
}
