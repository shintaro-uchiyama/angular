import * as grpc from "@grpc/grpc-js";
import { GreeterService, IGreeterServer } from "../generate/greeter_grpc_pb";
import { HelloRequest, HelloReply } from "../generate/greeter_pb";

//protoで定義したServiceを実装するクラス定義。今回はサンプルなのでmainと同じファイル内に同居。
class GreeterServer implements IGreeterServer {
  [name: string]: grpc.UntypedHandleCall;
  sayHello(
    call: grpc.ServerUnaryCall<HelloRequest, HelloReply>,
    callback: grpc.sendUnaryData<HelloReply>
  ): void {
    const reply = new HelloReply();
    reply.setMessage("Hello " + call.request.getName());
    //第一引数がエラーオブジェクト。第二引数がレスポンスオブジェクト。
    callback(null, reply);
  }
}

//サーバーを起動する。
function main() {
  const server = new grpc.Server();
  server.addService(GreeterService, new GreeterServer());
  //本番運用するときはTLSで通信するべきなので、createInsecure()ではなくcreateSsl()を使う
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Server started on port 50051");
    }
  );
}

main();
