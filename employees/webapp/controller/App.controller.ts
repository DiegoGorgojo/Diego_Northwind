import { layout } from "sap/ui/commons/library";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logaligroup.employees.controller
 */
export default class App extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
          this.viewModel();
         // this.loadEmployees();
    }
    private viewModel () : void {
const data = {
    layout: "OneColumn"    /**"TwoColumnsMidExpanded"*/
};
const model = new JSONModel(data);
this.setModel(model, "view");
    }

    private loadEmployees () : void {
        const model = new JSONModel();
        model.loadData("../model/Employees.json");
        this.setModel(model, "employees");

    }
}