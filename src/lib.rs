mod routes;

use axum::{routing::get, Router};
use routes::health_check;
use tower_http::services::{ServeDir, ServeFile};

pub fn app() -> Router {
    Router::new()
        .route("/health_check", get(health_check))
        .fallback_service(
            ServeDir::new("public").not_found_service(ServeFile::new("public/index.html")),
        )
}
