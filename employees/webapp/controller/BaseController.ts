import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import History from "sap/ui/core/routing/History";

/**
 * @namespace com.logaligroup.employees.controller
 */


export default class BaseController extends Controller {

    public getRouter(): Router {
        return (this.getOwnerComponent() as UIComponent).getRouter();
    }

    public getModel(name: string): Model {
        return this.getView()?.getModel(name) as Model;
    }

    public setModel(model: Model, name? : string): void {
        this.getView()?.setModel(model, name);
    }

    public getResourceBundle(): ResourceBundle {
        return <ResourceBundle> ((this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle();
    }

    public onNavToBack() : void {
        let sPreviousHash = History.getInstance().getPreviousHash();
        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            this.getRouter().navTo("RouteMain");
        }
    }
}