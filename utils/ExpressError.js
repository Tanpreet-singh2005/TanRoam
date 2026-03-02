class ExpressError extends Error{
  constructor(statusCode,message){
    super();
    this.statusCOde=statusCode;
    this.message=message;
  }
}
module.exports=ExpressError;