class ApiResponse {
  constructor(
    public statusCode: number,
    public message: string = "Sucess",
    public data: any | null,
    public success: boolean
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
