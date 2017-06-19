import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';


@Injectable()
export class ReceiptService {
  step: any;

  addNewReceipt(name, comment) {
  }

  getReceipts() {
  }

  getIngredients(receipt) {
  }

  // deprecated
  addStep(receiptKey: string) {
  }

  // deprecated
  saveStep(receiptKey: string, instructionsText: string) {
  }

  saveContent(receiptKey: string, instructionsText: string) {
  }

  loadContent(receiptKey: string) {
  }

  addReceiptImage(event, receipt) {
    let my = this;
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) {
      return;
    }
    let file: File = fileList[0];
  }

  // add an image which is embedded in tinymce to firebase and replace the tinymce defined Url
  // of the image with Url returned from Firebase by calling success
  addEmbeddedImage(event, receiptKey) {
    debugger;
  }
}
