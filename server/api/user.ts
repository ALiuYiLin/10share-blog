import { Request } from "express";
import { Api } from "../utils";

export const getUsers:Api = {
  path: "/user",
  method: "get",
  apiHandler: async (req: Request) => {
    return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
  },
};

export const asb = ()=>{
  console.log("saaa");
}