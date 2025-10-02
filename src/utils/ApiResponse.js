class ApiResponse {
    constructor(statusCode, message="success", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = stausCode < 400;
        this.data = data;
    }
}

export { ApiResponse };