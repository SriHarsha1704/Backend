class ApiResponse{            //we use this class as default to send the responses 
    constructor(statusCode,data,message="Success"){   // we create a new constructors on the code and send them
        this.statusCode=statusCode                  // new ApiResponse creates new empty object {}
        this.data=data                              // status/data/message gets the data from the controllers  
        this.message=message                        // this.status/data/message store the data that created at controllers in the new object
        this.success=statusCode<400   //boolean 
    }
}
export {ApiResponse}