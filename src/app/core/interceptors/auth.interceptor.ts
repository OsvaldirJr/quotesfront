import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    // TODO: implementar quando precisar de token
    // if(needs token){
    //   const authToken = '';
    //   const newReq = req.clone({
    //     // headers: req.headers.append('Authorization: Basic', authToken),
    //   });
    //   return handler.handle(newReq);
    // }
    
    return handler.handle(req);
  }
}