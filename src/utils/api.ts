export const request =  async <T>(input: string | URL | Request,init?: RequestInit)=>{
  return await (await fetch(input,init)).json() as {code:number,data:T,message:string}
}