import { Component, ElementRef, OnInit, OnChanges, EventEmitter, Output, Inject, ComponentRef, SimpleChanges } from '@angular/core';

declare var tinymce: any;

@Component({
    selector: 'editor',
    styleUrls: ['./editor.css'],
    template: `
    <div id="tinyFormGroup" class="form-group">
        <div class="hidden">
            <textarea id="baseTextArea">{{htmlContent}}</textarea>
        </div>
    </div>`,
    inputs: ['mceContent'],
    outputs: ['contentChanged', 'saveContent', 'uploadImage']
})

// source of this module - 
// http://www.unitydatasystems.com/blog/2015/12/16/angular-2-tinymce-wysiwyg-editor/

export class EditorComponent implements OnChanges {

    private elementRef: ElementRef;
    private elementID: string;
    private htmlContent: string;

    public contentChanged: EventEmitter<any>;
    public saveContent: EventEmitter<any>;
    public uploadImage: EventEmitter<any>;

    constructor( @Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;

        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        this.elementID = 'tinymce' + uniqid;
        this.contentChanged = new EventEmitter();
        this.saveContent = new EventEmitter();
        this.uploadImage = new EventEmitter();
    }

    ngAfterViewInit() {
        //Clone base textarea
        var baseTextArea = this.elementRef.nativeElement.querySelector("#baseTextArea");
        var clonedTextArea = baseTextArea.cloneNode(true);
        clonedTextArea.id = this.elementID;

        var formGroup = this.elementRef.nativeElement.querySelector("#tinyFormGroup");
        formGroup.appendChild(clonedTextArea);

        //Attach tinyMCE to cloned textarea
        tinymce.init(
            {
                mode: 'exact',
                height: 400,
                theme: 'modern',
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table contextmenu paste code imagetools'
                ],
                skin_url: '../../../../assets/skins/lightgray',
                toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code',
                imagetools_cors_hosts: ['localhost', 'firebasestorage.googleapis.com'],
                elements: this.elementID,
                setup: this.tinyMCESetup.bind(this),

                // enable title field in the Image dialog
                image_title: true,
                // enable automatic uploads of images represented by blob or data URIs
                automatic_uploads: true,
                // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
                images_upload_handler: this.tinyMCEUploadHandler.bind(this),
                // here we add custom filepicker only to Image dialog
                file_picker_types: 'image',
                // and here's our custom image picker
                file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    // Note: In modern browsers input[type="file"] is functional without 
                    // even adding it to the DOM, but that might not be the case in some older
                    // or quirky browsers like IE, so you might want to add it to the DOM
                    // just in case, and visually hide it. And do not forget do remove it
                    // once you do not need it anymore.

                    input.onchange = function (event: any) {
                        var my = this;
                        let fileList: FileList = event.target.files;
                        if (fileList.length == 0) {
                            console.log("cannot upload, no file selected");
                            return;
                        }
                        let file: File = fileList[0];

                        // Note: Now we need to register the blob in TinyMCEs image blob
                        // registry. In the next release this part hopefully won't be
                        // necessary, as we are looking to handle it internally.
                        var id = 'blobid' + (new Date()).getTime();
                        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                        var blobInfo = blobCache.create(id, file);
                        blobCache.add(blobInfo);

                        // call the callback and populate the Title field with the file name
                        cb(blobInfo.blobUri(), { title: file.name });
                    };

                    input.click();
                }
            }
        );
    }

    // detect a changing mceContent attribute and refresh the content
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['mceContent']) {
            if (tinymce.get(this.elementID)) {
                tinymce.get(this.elementID).setContent(this.htmlContent);
            }
        }
    }

    ngOnDestroy() {
        //destroy cloned elements
        tinymce.get(this.elementID).remove();

        var elem = document.getElementById(this.elementID);
        // elem.parentElement.removeChild(elem);
    }

    tinyMCESetup(ed) {
        let my = this;
        ed.on('keyup', this.tinyMCEOnKeyup.bind(this));
        ed.addMenuItem('saveDocument', {
            text: 'Save document',
            context: 'file',
            onclick: function () {
                my.tinyMCESaveContent(ed);
            }
        });
    }

    tinyMCEUploadHandler(blobInfo, success, failure) {
        this.uploadImage.emit({ blobInfo: blobInfo, success: success, failure: failure });
    }

    // user called Save Document on the menu
    tinyMCESaveContent(e) {
        this.saveContent.emit(tinymce.get(this.elementID).getContent());
    }

    // user entered some character on the keyboard
    tinyMCEOnKeyup(e) {
        this.contentChanged.emit(tinymce.get(this.elementID).getContent());
    }

    set mceContent(content) {
        this.htmlContent = content;
    }
}