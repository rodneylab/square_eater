use shared::app;

#[tokio::main]
async fn main() {
    let listen_address = "0.0.0.0:8000";
    let listener = tokio::net::TcpListener::bind(listen_address).await.unwrap();
    println!("Local    http://{listen_address}/");
    axum::serve(listener, app()).await.unwrap();
}
