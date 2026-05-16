class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.status = statusCode < 400 ? 'success' : 'error';
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;