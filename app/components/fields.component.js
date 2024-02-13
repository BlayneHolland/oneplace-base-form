/** 
* ====================================================================== 
* Form fields - v0.18
* 
* Updated on 02/11/2024
* Use with Form component
* ======================================================================= 
**/

/**
* TODOS
*
* [ x ] Each has a sepeate $emit that emits only the field's value
* [ ] (repeat) make fields more $emit based
*
*
*
**/

/** 
* ====================================================================== 
* Input Component
* ======================================================================= 
**/

export const TextInput = {

    template: `
    <div :class="['text__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> </label>
        <input type="text" :id='formatLabel' v-model="fieldStatus.value"  :name='formatLabel' :maxlength="maxlength" :placeholder="placeholder" @paste="pasteText" @blur="checkField($event.target.value)" @keyup="checkField($event.target.value)" />
        </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'placeholder', 'required', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    watch: {
        initValue(newValue, oldValue) {
            this.fieldStatus.value = newValue;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
        }
    },
    methods: {
        pasteText(event) {
            
            // Handle when the user pastes text into the field
            // Get pasted data via clipboard API

            // This prevents the pasted text from showing up twice
            event.preventDefault();
            let clipboardData = event.clipboardData || window.clipboardData;
            let pastedData = clipboardData.getData('Text');

            this.fieldStatus.value = pastedData;
            this.checkField();

        },
        checkField() {

            // console.log(inputValue);

            let inputValue = this.fieldStatus.value;


            // Make sure value isn't undefined
            if(inputValue == undefined) {
                inputValue = "";
                this.fieldStatus.value = "";
            }

            // Field is touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }

            if(this.required == true) {

                // If requied and the field is blank
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);
                    return this.fieldStatus;
                }

                // If pattern (regular expression) prop is defined then check to make sure the input matches the pattern
                if(this.pattern != undefined) {

                    if(this.pattern == 'email') {
                       var rePattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "i");
                    } 
                    else {
                        var rePattern = new RegExp(this.pattern, "i");
                    }
                    
                    if(rePattern.test(inputValue)) {
    
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } else if (inputValue == "") {
            
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    }
                }

                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    $emit('update:modelValue', this.fieldStatus);
                    return this.fieldStatus;
                }
            } 

            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;
            inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = false;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // this might not be needed
            this.fieldRequired == undefined || this.fieldRequired == false ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // If somehting is wrong with the fields then remove this experimental feature
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }

        // Is the field required?
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}









/** 
* ====================================================================== 
* Password Input Component
* ======================================================================= 
**/

export const PasswordInput = {

    template: `
    <div :class="['text__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> </label>
        <input type="password" :id='formatLabel' v-model="fieldStatus.value"  :name='formatLabel' :maxlength="maxlength" :placeholder="placeholder" @keyup="checkField($event.target.value)" />
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'placeholder', 'required', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField() {
            // console.log(inputValue);

            let inputValue = this.fieldStatus.value;


            // Make sure value isn't undefined
            if(inputValue == undefined) {
                inputValue = "";
                this.fieldStatus.value = "";
            }

            // Field is touched
            if(inputValue) {
            
                this.fieldStatus.fieldTouched = true;
            }

            if(this.required == true) {

                // If requied and the field is blank
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);
                    return this.fieldStatus;
                }

                // If pattern (regular expression) prop is defined then check to make sure the input matches the pattern
                if(this.pattern != undefined) {

                    if(this.pattern == 'email') {
                       var rePattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "i");
                    } 
                    else {
                        var rePattern = new RegExp(this.pattern, "i");
                    }
                    
                    if(rePattern.test(inputValue)) {
    
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } else if (inputValue == "") {
            
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    }
                }

                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    $emit('update:modelValue', this.fieldStatus);
                    return this.fieldStatus;
                }
            } 

            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;
            inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = false;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // this might not be needed
            this.fieldRequired == undefined || this.fieldRequired == false ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // If somehting is wrong with the fields then remove this experimental feature
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus); // send data up to the parent. might not need this....
            this.$emit('emitValue', this.fieldStatus.value); 
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }

        // Is the field required?
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}



















/** 
* ====================================================================== 
* Input Dropdown Component

* A mix between an input and a dropdown.
* You must select an item from the dropdown in order for the input to be valid.
* 
* Example:
* <text-dropdown-input :options="[{'label': 'one', 'value':'one'}]"> </text-dropdown-input>
* ======================================================================= 
**/
export const TextDropdownInput = {

    template: `
    <div :class="['text__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> </label>
        <input type="text" :id='formatLabel'  :name='formatLabel' :maxlength="maxlength" v-model="fieldStatus.value" :placeholder="placeholder" @focus="handleFocus" @keydown="filterOptions" />
        <ul v-show="dropdownIsShown">
            <li v-for="(item, index) in filteredOptions" :index="index" @click="updateField(item.value)"> {{ item.label }} </li>
            <li v-show="filteredOptions.length == 0"> no matches </li>
        </ul>

        {{fieldStatus.value}}
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                fieldTouched: false,
                fieldSubmitted: false,
            },
            dropdownIsShown: false,
            dropdownItemIsSelected: false,
            fieldRequired: false,
            filteredOptions: []
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'placeholder', 'required', 'initValue', 'options'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField() {
            // console.log(inputValue);

            let inputValue = this.fieldStatus.value;


            // Make sure value isn't undefined
            if(inputValue == undefined) {
                inputValue = "";
                this.fieldStatus.value = "";
            }


            // Field is touched
            if(inputValue) {
            
                this.fieldStatus.fieldTouched = true;
            }

       


            if(this.required == true) {
       
                // If requied and the field is blank
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);
                    return this.fieldStatus;
                }

                // If pattern (regular expression) prop is defined then check to make sure the input matches the pattern
                if(this.pattern != undefined) {

                    if(this.pattern == 'email') {
                       var rePattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "i");
                    } 
                    else {
                        var rePattern = new RegExp(this.pattern, "i");
                    }
                    
                    if(rePattern.test(inputValue)) {
    
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } else if (inputValue == "") {
            
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    }

                    
                }
                console.log("check field 5");

                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    $emit('update:modelValue', this.fieldStatus);
                    return this.fieldStatus;
                }
            } 

            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;
            inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = false;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // this might not be needed
            this.fieldRequired == undefined || this.fieldRequired == false ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // If somehting is wrong with the fields then remove this experimental feature
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        },
        handleFocus() {
            console.log("showing the dropdown");
            this.dropdownIsShown = true;
        },
        handleBlur() {
            this.dropdownIsShown = false;
        },
        updateField(value) {
            this.dropdownItemIsSelected = true;
            this.fieldStatus.value = value;
            this.checkField();
            this.dropdownIsShown = false;
        },
        filterOptions() {
            this.dropdownItemIsSelected = false;

            let resultLimit = 4;

            // Make sure the field is clear when the filter starts
            // if(this.fieldStatus.value != "") {
            //     this.fieldStatus.value = "";
            // }

            if(this.fieldStatus.value == "") {
                this.filteredOptions = this.options.filter(item => true).slice(0, resultLimit);
                return false;
            }

            let result = [];
            console.log(this.options);

            result = this.options.filter(item => {
                return item.value.toLowerCase().includes(this.fieldStatus.value);
            }).slice(0, resultLimit);

            console.log(result);

            this.filteredOptions = result;

           
           
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }

        // Is the field required?
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}




/** 
* ====================================================================== 
* File Input Component
* ======================================================================
**/

export const FileInput = {
    
    template: `
    <div :class="['file__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }} </label>
        <input type="file" :id='formatLabel' ref='fileInputObj' :name='formatLabel' @click="clearFile($event.target)"  @input="$emit('update:modelValue', checkField($event.target))" multiple />
        <span v-show="checkInvalid()"> {{ statusMessage }} </span>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                type: "file",
                fieldTouched: false,
                fieldSubmitted: false
            },
            inputRequired: false,
            statusMessage: "",
            p_maxFileSize: 25, /*in Mbs*/
            p_fileTypes: [
                'txt', 'jpg', 'pdf', 'jpeg', 'tiff', 'tif', 'mp3', 'mp4', 'mpeg', 'mpg', 
                'wav', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'numbers', 'js', 'zip',
                '7z', 'gz', 'tar', 'rar', 'gzip', 'png'
            ]
        }
    },
    props: ['modelValue', 'label', 'required', 'maxFileSize', 'fileTypes'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {

        checkField(inputValue) {

            // This has to be first
            if(this.inputRequired == true && inputValue == undefined) {
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
                return false;
            }

            if(this.inputRequired == true) {
                console.log("setting the field as invalid")
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
            }

            // This has to be second
            if(inputValue == undefined) {
                return false;
            }


           
            this.fieldStatus.fieldTouched = true;

           

            var inputFiles = inputValue.files;
            var filesArr = [];


            if(inputFiles.length > 0 ) {

                this.fieldStatus.invalid = false;

                /** 
                * ====================================================================== 
                * Check File Extnesion
                * ======================================================================= 
                **/
                for (let i = 0; i < inputFiles.length; i++) {
                    var fextension = inputFiles[i].name.split('.').splice(-1,1)[0].toLowerCase();
    
                    if(this.p_fileTypes.indexOf(fextension) < 0 ) {
                        // The file extension is not accepted.
                        alert('File extension ".'+ fextension +'" not accepted');
                        this.showStatusMessage('File extension ".'+ fextension +'" not accepted');
                        inputValue.value = "";
                        this.fieldStatus.value = "";
                        this.fieldStatus.invalid = true;
                        if(this.inputRequired == false) {
                            this.fieldStatus.invalid = false;
                        }
                        return this.fieldStatus;
                    }
                }


                /** 
                * ====================================================================== 
                * Check File Size
                * ======================================================================= 
                **/
                var totalFileSize = 0;
                for(let i = 0; i < inputFiles.length; i++) {
                    totalFileSize = totalFileSize + inputFiles[i].size;
                }


                // Check to ensure the file does not exceed 3mbs
                if(totalFileSize > this.maxFileSizeToBytes ) {
                    alert("Invaild: File exceeds "+this.maxFileSize.toFixed()+"Mbs");
                    this.showStatusMessage("Invaild: File exceeds "+this.p_maxFileSize.toFixed()+"Mbs");
                    inputValue.value = "";
                    this.fieldStatus.value = "";
                    this.fieldStatus.invalid = true;
                    return this.fieldStatus
                }

                
                // Load the files into te array
                for (let i = 0; i < inputFiles.length; i++) {
                    filesArr.push(inputFiles[i]);
                }

                this.fieldStatus.value = filesArr;

            } // end inputValue.length > 0


  

            return this.fieldStatus;
            
        },
        checkInvalid() {
            // Check if field is invalid

            if(this.fieldStatus.fieldTouched && this.fieldStatus.invalid == false) {
                return false;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            if(this.fieldStatus.fieldTouched) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        clearField() {
            this.$refs.fileInputObj.value = "";
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        },
        fileInfo(theFile) {
            console.log(theFile);
        },
        showStatusMessage(message, timeInMilliseconds) {

            // Shows message for a limited amount of time.
            this.statusMessage = message;

            if(timeInMilliseconds != undefined) {
                setTimeout(() => {
                    this.statusMessage = message
                }, timeInMilliseconds);
            }

        },
        clearFile() {

            this.fieldStatus.value = '';
            this.statusMessage = '';
            if(this.inputRequired == false) {
                this.fieldStatus.invalid = false;
            }
            if(this.inputRequired == true) {
                console.log("making field invalid");
                this.fieldStatus.invalid = true;
                this.statusMessage = 'File Required';
                console.log(this.fieldStatus.invalid);

            }
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);

        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        },
        maxFileSizeToBytes() {
            return (this.p_maxFileSize * 1000000);
        }
    },
    created() {
      

        // Set default max file size
        if(this.maxFileSize != undefined) {
            this.p_maxFileSize = this.maxFileSize;
        } 

        console.log(this.p_maxFileSize);

        // set default accepted file types
        if (this.fileTypes != undefined) {
            this.p_fileTypes = this.fileTypes;
        }
        
        // Is the field required?
        this.required == undefined ? this.inputRequired = false : this.inputRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}









/** 
* ====================================================================== 
* File Image Input Component
* This file input is geared specifially towards images.
* It should show a preview of the image being uploaded
* Mainly used to drag and drop images into a box
* ======================================================================
**/

export const FileImageInput = {
    template: `
      <div
      :class="['file__input-group', 'form__input-group', {'form__input-group-error': checkInvalid()}, 'cmp-file-img-input']"  
      >
        <input
          type="file"
          :id="formatLabel"
          ref="fileInputObj"
          :name="formatLabel"
          @click="clearFile($event.target)"
          @change="handleFileSelect"
          @input="$emit('update:modelValue', checkField($event.target))"
          accept="image/*"
        />
        <label :for="formatLabel">
            <div>
                <slot></slot>
                <img class="cmp-file-img-input-img" v-if="previewImageUrl" :src="previewImageUrl" />
            </div>
        </label>
        <span v-show="checkInvalid()">{{ statusMessage }}</span>
      </div>
    `,
  
    data() {
      return {
        fieldStatus: {
          value: '',
          invalid: false,
          type: 'file',
          fieldTouched: false,
          fieldSubmitted: false,
        },
        previewImageUrl: '',
        isHovered: false,
        inputRequired: false,
        statusMessage: '',
        p_maxFileSize: 25, /* in Mbs */
        p_fileTypes: ['jpg', 'jpeg', 'tiff', 'tif', 'png'],
      };
    },
  
    props: ['modelValue', 'label', 'required', 'maxFileSize', 'fileTypes'],
    emits: ['update:modelValue', 'updateForm'],
    methods: {


  
      handleFileSelect(e) {
        const file = e.target.files[0];
        this.readFile(file);
      },
  
      readFile(file) {
        if (file && this.isFileValid(file)) {
          const reader = new FileReader();
          reader.onload = () => {
            this.previewImageUrl = reader.result;
          };
          reader.readAsDataURL(file);
        }
      },
  
      isFileValid(file) {
        const { size, type } = file;
        const maxSize = this.p_maxFileSize * 1024 * 1024; // Convert to bytes
        const isValidType = this.p_fileTypes.some((validType) =>
          type.includes(validType)
        );
  
        if (size > maxSize) {
          this.statusMessage = 'File size exceeds the maximum limit.';
          return false;
        } else if (!isValidType) {
          this.statusMessage = 'Invalid file type. Please upload an image.';
          return false;
        } else {
          this.statusMessage = '';
          return true;
        }
      },



        setInitImage(url) {
            this.previewImageUrl = url;
        },

        checkField(inputValue) {

            console.log("checking field");

            // This has to be first
            if(this.inputRequired == true && inputValue == undefined) {
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
                return false;
            }

            if(this.inputRequired == true) {
                console.log("setting the field as invalid")
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
            }

            // This has to be second
            if(inputValue == undefined) {
                return false;
            }

            this.fieldStatus.fieldTouched = true;

            var inputFiles = inputValue.files;
            var filesArr = [];


            if(inputFiles.length > 0 ) {

                this.fieldStatus.invalid = false;

                /** 
                * ====================================================================== 
                * Check File Extnesion
                * ======================================================================= 
                **/
                for (let i = 0; i < inputFiles.length; i++) {
                    var fextension = inputFiles[i].name.split('.').splice(-1,1)[0].toLowerCase();
    
                    if(this.p_fileTypes.indexOf(fextension) < 0 ) {
                        // The file extension is not accepted.
                        alert('File extension ".'+ fextension +'" not accepted');
                        this.showStatusMessage('File extension ".'+ fextension +'" not accepted');
                        inputValue.value = "";
                        this.fieldStatus.value = "";
                        this.fieldStatus.invalid = true;
                        if(this.inputRequired == false) {
                            this.fieldStatus.invalid = false;
                        }
                        return this.fieldStatus;
                    }
                }


                /** 
                * ====================================================================== 
                * Check File Size
                * ======================================================================= 
                **/
                var totalFileSize = 0;
                for(let i = 0; i < inputFiles.length; i++) {
                    totalFileSize = totalFileSize + inputFiles[i].size;
                }


                // Check to ensure the file does not exceed 3mbs
                if(totalFileSize > this.maxFileSizeToBytes ) {
                    alert("Invaild: File exceeds "+this.maxFileSize.toFixed()+"Mbs");
                    this.showStatusMessage("Invaild: File exceeds "+this.p_maxFileSize.toFixed()+"Mbs");
                    inputValue.value = "";
                    this.fieldStatus.value = "";
                    this.fieldStatus.invalid = true;
                    return this.fieldStatus
                }

                
                // Load the files into te array
                for (let i = 0; i < inputFiles.length; i++) {
                    filesArr.push(inputFiles[i]);
                }

                this.fieldStatus.value = filesArr;

            } // end inputValue.length > 0


  

            return this.fieldStatus;
            
        },
        checkInvalid() {
            // Check if field is invalid

            if(this.fieldStatus.fieldTouched && this.fieldStatus.invalid == false) {
                return false;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            if(this.fieldStatus.fieldTouched) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        clearField() {
            this.$refs.fileInputObj.value = "";
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus); // send data up to the parent. might not need this....
            this.$emit('emitValue', this.fieldStatus.value);
        },
        fileInfo(theFile) {
            console.log(theFile);
        },
        showStatusMessage(message, timeInMilliseconds) {

            // Shows message for a limited amount of time.
            this.statusMessage = message;

            if(timeInMilliseconds != undefined) {
                setTimeout(() => {
                    this.statusMessage = message
                }, timeInMilliseconds);
            }

        },
        clearFile() {

            this.fieldStatus.value = '';
            this.statusMessage = '';
            if(this.inputRequired == false) {
                this.fieldStatus.invalid = false;
            }
            if(this.inputRequired == true) {
                console.log("making field invalid");
                this.fieldStatus.invalid = true;
                this.statusMessage = 'File Required';
                console.log(this.fieldStatus.invalid);

            }
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);

        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        },
        maxFileSizeToBytes() {
            return (this.p_maxFileSize * 1000000);
        }
    },
    created() {
      

        // Set default max file size
        if(this.maxFileSize != undefined) {
            this.p_maxFileSize = this.maxFileSize;
        } 

        console.log(this.p_maxFileSize);

        // set default accepted file types
        if (this.fileTypes != undefined) {
            this.p_fileTypes = this.fileTypes;
        }
        
        // Is the field required?
        this.required == undefined ? this.inputRequired = false : this.inputRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}





/** 
* ====================================================================== 
* File Input v2 Component
* 
* 
* This file input component allows the user to select multiple files/
* It shows the user a list of files they have selected.
* ======================================================================
**/

export const FileInputv2 = {
    
    template: `
    <div :class="['file__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <button class="upload-file-button" @click="triggerFileInput()"> {{ label }} </button>
        <label style="display: none" :label='formatLabel' :for='formatLabel'> {{ label }} </label>
        <input style="display: none" ref="upload_button" type="file" :id='formatLabel' :name='formatLabel' @click="clearFile($event.target)" @change="inputChange()" @input="$emit('update:modelValue', checkField($event.target))" multiple />
        <span v-show="checkInvalid()"> {{ statusMessage }} </span> 
        <ul v-show="fileList.length > 0">
            <li v-for="(fileName, index) in fileList" :key="index"> {{fileName}} </li> 
        </ul>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                type: "file",
                fieldTouched: false,
                fieldSubmitted: false,
            },
            fileList: [],
            inputRequired: false,
            statusMessage: "",
            p_maxFileSize: 25, /*in Mbs*/
            p_fileTypes: [
                'txt', 'jpg', 'pdf', 'jpeg', 'tiff', 'tif', 'mp3', 'mp4', 'mpeg', 'mpg', 
                'wav', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'numbers', 'js', 'zip',
                '7z', 'gz', 'tar', 'rar', 'gzip', 'png'
            ]
        }
    },
    props: ['modelValue', 'label', 'required', 'maxFileSize', 'fileTypes'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        triggerFileInput() {
            this.$refs['upload_button'].click();
        },
        inputChange() {
            // this.fileList = this.$refs['upload_button'].value.split('\\').pop();;
            this.fileList = [];
            files = this.$refs['upload_button'].files;
            for (let i = 0; i < files.length; i++) {

                this.fileList.push(files[i].name);

                // if(i != files.length - 1) {
                //     this.fileList += files[i].name + ", ";                      
                // } else {
                //     this.fileList += files[i].name;
                    
                // }
            }
            console.log(this.$refs['upload_button'].files[0].name);
        },
        checkField(inputValue) {

            // This has to be first
            if(this.inputRequired == true && inputValue == undefined) {
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
                return false;
            }

            if(this.inputRequired == true) {
                console.log("setting the field as invalid")
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
            }

            // This has to be second
            if(inputValue == undefined) {
                return false;
            }


           
            this.fieldStatus.fieldTouched = true;

           

            var inputFiles = inputValue.files;
            var filesArr = [];


            if(inputFiles.length > 0 ) {

                this.fieldStatus.invalid = false;

                /** 
                * ====================================================================== 
                * Check File Extnesion
                * ======================================================================= 
                **/
                for (let i = 0; i < inputFiles.length; i++) {
                    var fextension = inputFiles[i].name.split('.').splice(-1,1)[0].toLowerCase();
    
                    if(this.p_fileTypes.indexOf(fextension) < 0 ) {
                        // The file extension is not accepted.
                        alert('File extension ".'+ fextension +'" not accepted');
                        this.showStatusMessage('File extension ".'+ fextension +'" not accepted');
                        inputValue.value = "";
                        this.fieldStatus.value = "";
                        this.fieldStatus.invalid = true;
                        if(this.inputRequired == false) {
                            this.fieldStatus.invalid = false;
                        }
                        return this.fieldStatus;
                    }
                }


                /** 
                * ====================================================================== 
                * Check File Size
                * ======================================================================= 
                **/
                var totalFileSize = 0;
                for(let i = 0; i < inputFiles.length; i++) {
                    totalFileSize = totalFileSize + inputFiles[i].size;
                }


                // Check to ensure the file does not exceed 3mbs
                if(totalFileSize > this.maxFileSizeToBytes ) {
                    alert("Invaild: File exceeds "+this.maxFileSize.toFixed()+"Mbs");
                    this.showStatusMessage("Invaild: File exceeds "+this.p_maxFileSize.toFixed()+"Mbs");
                    inputValue.value = "";
                    this.fieldStatus.value = "";
                    this.fieldStatus.invalid = true;
                    return this.fieldStatus
                }

                
                // Load the files into te array
                for (let i = 0; i < inputFiles.length; i++) {
                    filesArr.push(inputFiles[i]);
                }

                this.fieldStatus.value = filesArr;

            } // end inputValue.length > 0


  

            return this.fieldStatus;
            
        },
        checkInvalid() {
            // Check if field is invalid

            if(this.fieldStatus.fieldTouched && this.fieldStatus.invalid == false) {
                return false;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            if(this.fieldStatus.fieldTouched) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        clearField() {
            this.$refs['upload_button'].value = "";
            this.fileList = "";
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        },
        fileInfo(theFile) {
            console.log(theFile);
        },
        showStatusMessage(message, timeInMilliseconds) {

            // Shows message for a limited amount of time.
            this.statusMessage = message;

            if(timeInMilliseconds != undefined) {
                setTimeout(() => {
                    this.statusMessage = message
                }, timeInMilliseconds);
            }

        },
        clearFile() {

            this.fieldStatus.value = '';
            this.statusMessage = '';
            if(this.inputRequired == false) {
                this.fieldStatus.invalid = false;
            }
            if(this.inputRequired == true) {
                console.log("making field invalid");
                this.fieldStatus.invalid = true;
                this.statusMessage = 'File Required';
                console.log(this.fieldStatus.invalid);

            }
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);

        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_");
        },
        maxFileSizeToBytes() {
            return (this.p_maxFileSize * 1000000);
        }
    },
    created() {
      

        // Set default max file size
        if(this.maxFileSize != undefined) {
            this.p_maxFileSize = this.maxFileSize;
        } 

        console.log(this.p_maxFileSize);

        // set default accepted file types
        if (this.fileTypes != undefined) {
            this.p_fileTypes = this.fileTypes;
        }
        
        // Is the field required?
        this.required == undefined ? this.inputRequired = false : this.inputRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}




/** 
* ====================================================================== 
* File Input v2 Component
* 
* 
* This file input component allows the user to select multiple files/
* It shows the user a list of files they have selected.
* ======================================================================
**/

export const FileInputTwoBeta = {
    
    template: `
    <div :class="['file__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <button class="upload-file-button" @click="triggerFileInput()"> {{ label }} </button>
        <label style="display: none" :label='formatLabel' :for='formatLabel'> {{ label }} </label>
        <input style="display: none" ref="upload_button" type="file" :id='formatLabel' :name='formatLabel' @click="clearFile($event.target)" @change="inputChange()" @input="$emit('update:modelValue', checkField($event.target))" multiple />
        <span v-show="checkInvalid()"> {{ statusMessage }} </span> 
        <ul v-show="fileList.length > 0">
            <li v-for="(fileName, index) in fileList" :key="index"> {{fileName}} </li> 
        </ul>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                type: "file",
                fieldTouched: false,
                fieldSubmitted: false,
            },
            fileList: [],
            inputRequired: false,
            statusMessage: "",
            p_maxFileSize: 25, /*in Mbs*/
            p_fileTypes: [
                'txt', 'jpg', 'pdf', 'jpeg', 'tiff', 'tif', 'mp3', 'mp4', 'mpeg', 'mpg', 
                'wav', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'numbers', 'js', 'zip',
                '7z', 'gz', 'tar', 'rar', 'gzip', 'png'
            ]
        }
    },
    props: ['modelValue', 'label', 'required', 'maxFileSize', 'fileTypes'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        triggerFileInput() {
            this.$refs['upload_button'].click();
        },
        inputChange() {
            // this.fileList = this.$refs['upload_button'].value.split('\\').pop();;
            this.fileList = [];
            files = this.$refs['upload_button'].files;
            for (let i = 0; i < files.length; i++) {

                this.fileList.push(files[i].name);

                // if(i != files.length - 1) {
                //     this.fileList += files[i].name + ", ";                      
                // } else {
                //     this.fileList += files[i].name;
                    
                // }
            }
            console.log(this.$refs['upload_button'].files[0].name);
        },
        checkField(inputValue) {

            // This has to be first
            if(this.inputRequired == true && inputValue == undefined) {
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
                return false;
            }

            if(this.inputRequired == true) {
                console.log("setting the field as invalid")
                this.fieldStatus.invalid = true;
                this.showStatusMessage("File Required");
            }

            // This has to be second
            if(inputValue == undefined) {
                return false;
            }


           
            this.fieldStatus.fieldTouched = true;

           

            var inputFiles = inputValue.files;
            var filesArr = [];


            if(inputFiles.length > 0 ) {

                this.fieldStatus.invalid = false;

                /** 
                * ====================================================================== 
                * Check File Extnesion
                * ======================================================================= 
                **/
                for (let i = 0; i < inputFiles.length; i++) {
                    var fextension = inputFiles[i].name.split('.').splice(-1,1)[0].toLowerCase();
    
                    if(this.p_fileTypes.indexOf(fextension) < 0 ) {
                        // The file extension is not accepted.
                        alert('File extension ".'+ fextension +'" not accepted');
                        this.showStatusMessage('File extension ".'+ fextension +'" not accepted');
                        inputValue.value = "";
                        this.fieldStatus.value = "";
                        this.fieldStatus.invalid = true;
                        if(this.inputRequired == false) {
                            this.fieldStatus.invalid = false;
                        }
                        return this.fieldStatus;
                    }
                }


                /** 
                * ====================================================================== 
                * Check File Size
                * ======================================================================= 
                **/
                var totalFileSize = 0;
                for(let i = 0; i < inputFiles.length; i++) {
                    totalFileSize = totalFileSize + inputFiles[i].size;
                }


                // Check to ensure the file does not exceed 3mbs
                if(totalFileSize > this.maxFileSizeToBytes ) {
                    alert("Invaild: File exceeds "+this.maxFileSize.toFixed()+"Mbs");
                    this.showStatusMessage("Invaild: File exceeds "+this.p_maxFileSize.toFixed()+"Mbs");
                    inputValue.value = "";
                    this.fieldStatus.value = "";
                    this.fieldStatus.invalid = true;
                    return this.fieldStatus
                }

                
                // Load the files into te array
                for (let i = 0; i < inputFiles.length; i++) {
                    filesArr.push(inputFiles[i]);
                }

                this.fieldStatus.value = filesArr;

            } // end inputValue.length > 0


  

            return this.fieldStatus;
            
        },
        checkInvalid() {
            // Check if field is invalid

            if(this.fieldStatus.fieldTouched && this.fieldStatus.invalid == false) {
                return false;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }

            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            if(this.fieldStatus.fieldTouched) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        clearField() {
            this.$refs['upload_button'].value = "";
            this.fileList = "";
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        },
        fileInfo(theFile) {
            console.log(theFile);
        },
        showStatusMessage(message, timeInMilliseconds) {

            // Shows message for a limited amount of time.
            this.statusMessage = message;

            if(timeInMilliseconds != undefined) {
                setTimeout(() => {
                    this.statusMessage = message
                }, timeInMilliseconds);
            }

        },
        clearFile() {

            this.fieldStatus.value = '';
            this.statusMessage = '';
            if(this.inputRequired == false) {
                this.fieldStatus.invalid = false;
            }
            if(this.inputRequired == true) {
                console.log("making field invalid");
                this.fieldStatus.invalid = true;
                this.statusMessage = 'File Required';
                console.log(this.fieldStatus.invalid);

            }
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);

        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_");  
        },
        maxFileSizeToBytes() {
            return (this.p_maxFileSize * 1000000);
        }
    },
    created() {
      

        // Set default max file size
        if(this.maxFileSize != undefined) {
            this.p_maxFileSize = this.maxFileSize;
        } 

        console.log(this.p_maxFileSize);

        // set default accepted file types
        if (this.fileTypes != undefined) {
            this.p_fileTypes = this.fileTypes;
        }
        
        // Is the field required?
        this.required == undefined ? this.inputRequired = false : this.inputRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}










/** 
* ====================================================================== 
* Special Multitext Component for Comm verification
* ======================================================================= 
**/

// WHat I want it to do. Validate based on regex
// Change the label
export const MultiTextInput = {

    template: `
    <div :class="['text__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> <small class="label-subtext"> {{ sublabel }} </small>  </label>
        <div class="multitext-input__container">
            <input type="text" v-model="multifield[0].value" maxlength="4" ref="multifield0" :name='formatLabel' :maxlength="maxlength"  @keyup="checkSplitfield(0)" @paste="pasteText" /> <img src="img/minus.svg"/>
            <input type="text" v-model="multifield[1].value" maxlength="3" ref="multifield1" :name='formatLabel' :maxlength="maxlength"  @keyup="checkSplitfield(1)" @paste="pasteText" /> <img src="img/minus.svg"/>
            <input type="text" v-model="multifield[2].value" maxlength="4" ref="multifield2" :name='formatLabel' :maxlength="maxlength"  @keyup="checkSplitfield(2)" @paste="pasteText" /> <img src="img/minus.svg"/>
            <input type="text" v-model="multifield[3].value" maxlength="4" ref="multifield3" :name='formatLabel' :maxlength="maxlength"  @keyup="checkSplitfield(3)" @paste="pasteText" />
        </div>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: false,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false,
            multifield: [
                {value: ''},
                {value: ''},
                {value: ''},
                {value: ''}
            ],
            currentSplitfield: 0
        }
    },
    props: ['modelValue', 'label','sublabel', 'pattern', 'maxlength', 'placeholder', 'required', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        pasteText(event) {
            console.log("pasting something");

            // Get pasted data via clipboard API
            clipboardData = event.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('Text');


            // Remove all dashes
            pastedData = pastedData.replace(/\-/g,"");


            // Split word into parts
            this.multifield[0].value = pastedData.slice(0,4);
            this.multifield[1].value = pastedData.slice(4,7);
            this.multifield[2].value = pastedData.slice(7,11);
            this.multifield[3].value = pastedData.slice(11,15);

            combinedValue = [this.multifield[0].value,"-",this.multifield[1].value,"-",this.multifield[2].value,"-",this.multifield[3].value ].join('');
            this.checkField(combinedValue);

        },
        checkSplitfield(fieldIndex) {

            // console.log(event.which);
            // 8 = Backspace
            // 13 = Enter
            // 37 = Left Arrow
            // 38 = Up Arrow
            // 39 = Right Arrow
            // 40 = Down Arrow

            var filterkeys = [
                37,
                38,
                39,
                40
            ];

            // You the user presses an arrow key dont do anything.
            if(filterkeys.indexOf(event.which) != -1) {
                return false;
            }

            switch (fieldIndex) {


                case 0:
                    // do something
                    if(this.multifield[fieldIndex].value.length >= 4) {
                        this.$refs.multifield1.focus();
                    }
                    break;

                case 1:
                    // do something
                    if(this.multifield[fieldIndex].value.length >= 3 && event.which != 8) {
                        this.$refs.multifield2.focus();
                    }

                    if(this.multifield[fieldIndex].value.length == 0 && event.which == 8) {
                        this.$refs.multifield0.focus();
                    }
                    break;
            
                case 2:
                    // do something
                    if(this.multifield[fieldIndex].value.length >= 4 && event.which != 8) {
                        this.$refs.multifield3.focus();
                    }

                    if(this.multifield[fieldIndex].value.length == 0 && event.which == 8) {
                        this.$refs.multifield1.focus();
                    }
                    break;

                case 3:
                    // do something
                    // do something
                    if(this.multifield[fieldIndex].value.length == 0 && event.which == 8) {
                        this.$refs.multifield2.focus();
                    }
                    break;

                default:
                    break;
            }

            combinedValue = [this.multifield[0].value,"-",this.multifield[1].value,"-",this.multifield[2].value,"-",this.multifield[3].value ].join('');
            this.checkField(combinedValue);
        },
        checkField(fieldInputValue) {
            // console.log(inputValue);

            inputValue = fieldInputValue;


            // Make sure value isn't undefined
            if(inputValue == undefined) {
                inputValue = "";
                this.fieldStatus.value = "";
            }

            // Field is touched
            if(inputValue) {
            
                this.fieldStatus.fieldTouched = true;
            }

            if(this.required == true) {

                // If requied and the field is blank
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);
                    return this.fieldStatus;
                }

                // If pattern (regular expression) prop is defined then check to make sure the input matches the pattern
                if(this.pattern != undefined) {

                    if(this.pattern == 'email') {
                        rePattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "i");
                    }
                    else {
                        var rePattern = new RegExp(this.pattern, "i");
                    }
                    
                    if(this.pattern == 'salenum') {
                        rePattern = new RegExp(/\w{4}\-?\w{3}\-?\w{4}\-?\w{4}/, "i");
                    } 
                    else {
                        var rePattern = new RegExp(this.pattern, "i");
                    }
                    
                    if(rePattern.test(inputValue)) {
    
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } else if (inputValue == "") {
            
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    }
                }

                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    $emit('update:modelValue', this.fieldStatus);
                    return this.fieldStatus;
                }
            } 

            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;
            inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.multifield[0].value = '';
            this.multifield[1].value = '';
            this.multifield[2].value = '';
            this.multifield[3].value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // this might not be needed
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }

        // Is the field required?
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}








/** 
* ====================================================================== 
* Select Component
* ======================================================================= 
**/

// WHat I want it to do. Validate based on regex
// Change the label
 export const SelectInput = {

    template: `
    <div :class="['select__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatName' :for='formatName'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> </label>
        <select :id='formatName' v-model="fieldStatus.value" :name='formatName'  @change="$emit('update:modelValue', checkField($event.target.value))" :multiple="multiple">
            <slot> </slot>
        </select>
    </div>    
    `,

    data() {
        return {
            fieldStatus: {
                value: [""],
                invalid: true,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false
        }
    },
    props: ['modelValue', 'label', 'name', 'pattern', 'required', 'multiple', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField(inputValue) {
            
            var inputValue = this.fieldStatus.value; 
            // Note!: The SELECT input even handler was switched from @input to @change. If there's a problem, change it back to @input
            // uncomment if there are issues. Uncommenting this makes it so the field appears invalid even after submitting. Not sure why I added this line in in the first place so im keeping it here.
            // The line above was commented because the field will remain blank even when you select something. If its a required field however, an error will occur.
            //inputValue = this.fieldStatus.value; // Remove this line. may not be nessesary for select inputs

            // Make sure value isn't undefined
            if(inputValue == undefined) {


                if(this.multiple) {
                    inputValue = new Array();
                    this.fieldStatus.value = new Array();
                    this.initValue == undefined ? this.fieldStatus.value = inputValue : this.fieldStatus.value = this.initValue; //set init value
                    
                } else {
                    inputValue = "";
                    this.fieldStatus.value = "";
                    this.initValue == undefined ? this.fieldStatus.value = inputValue : this.fieldStatus.value = this.initValue; //set init value
                }
            }


            if(this.required === true) {

                // You cant change prop values, not sure why this is here...
                // if(this.initValue == undefined) {
                //     this.initValue = "";
                // }

                // If requied and the field is blank
                if(inputValue == "") {
            
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    //this.fieldStatus.fieldTouched ? this.fieldStatus.invalid = true : this.fieldStatus.invalid = false;
                    //this.initValue == undefined ? this.fieldStatus.value = inputValue : this.fieldStatus.value = this.initValue; //set init value
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);

                    return this.fieldStatus;
                }

                // If pattern prop is entered check the pattern
                if(this.pattern != undefined) {
                    var rePattern = new RegExp(this.pattern, "i");
                    if(rePattern.test(inputValue)) {
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;

                        return this.fieldStatus;

                    } else if (inputValue == "") {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);

                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);

                        return this.fieldStatus;
                    }
                }


                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);
                    return this.fieldStatus;
                }

                // Return input value. Remove the two lines below if there are problems.
                // Try to resolve the problem where required fields would just not show a value
                // when changing the value of the input field.
                this.fieldStatus.value = inputValue;
                this.$emit('update:modelValue', this.fieldStatus);
                this.$emit('emitValue', this.fieldStatus.value);


            } 

            // Field is touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }
            


            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;

            // if(this.multiple) {
            //     inputValue == undefined ? this.fieldStatus.value = [""] : this.fieldStatus.value = inputValue;
            // } else {
            //     inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;
            // }

            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);


            return this.fieldStatus;
        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }
            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.required == undefined || this.required == false ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true; // If somehting is wrong with the fields then remove this experimental feature
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus); // send data up to the parent. might not need this....
            this.$emit('emitValue', this.fieldStatus.value);

        }
    },
    computed: {
        formatName() {
            // Converts input string into kebab-case is it has spaces.
            return this.name.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {



        if(this.multiple) {
            this.fieldStatus.value = new Array();
        }


        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }

        if(this.name == undefined) {
            console.log("Warning: name attribute is missing for select input");
            alert("Warning: name attribute is missing for select input");
        }
        if(this.label == undefined) {
            console.log("Notice: Label Missing for select input");
        }

        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}



















/** 
* ====================================================================== 
* Textarea Component
* ======================================================================= 
**/

// WHat I want it to do. Validate based on regex
// Change the label
export const TextareaInput = {

    template: `
    <div :class="['textarea__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }}  <span v-show="checkInvalid()" class="fa fa-exclamation-circle"> </span> </label>
        <textarea type="text" :id='formatLabel' :maxlength="maxlength" v-model="fieldStatus.value" :placeholder="placeholder" :name='formatLabel'  @input="$emit('update:modelValue', checkField($event.target.value))" > </textarea>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: true,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'placeholder', 'required', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField(inputValue) {

            inputValue = this.fieldStatus.value;

            // Make sure value isn't undefined
            if(inputValue == undefined) {
                inputValue = "";
                this.fieldStatus.value = "";
            }

            // Field is touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }

            if(this.required == true) {

                // If requied and the field is blank
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    return this.fieldStatus;
                }

                // If pattern prop is entered check the pattern
                if(this.pattern != undefined) {
                    var rePattern = new RegExp(this.pattern, "i");
                    if(rePattern.test(inputValue)) {
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;
                        return this.fieldStatus;
                    } else if (inputValue == "") {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        return this.fieldStatus;
                    }
                }

                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    return this.fieldStatus;
                }
            } 

            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;
            inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }
            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus); // send data up to the parent. might not need this....
            this.$emit('emitValue', this.fieldStatus.value);
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }

        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);

    }
}



















/** 
* ====================================================================== 
* Radio Component (new)
* ======================================================================= 
**/



// WHat I want it to do. Validate based on regex
// Change the label
export const RadioInput = {

    template: `
        <div :class="['radio__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
            <h3> {{ title }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"> </span> </h3>
            <div class="form-component_radio-input-options">
                <div v-for="option in options">
                    <input type='radio' v-model='fieldStatus.value' :id='formatLabel(option.label)' :value='option.value' :name='group' @change='$emit("update:modelValue", checkField($event.target.value))' />
                    <label :label='formatLabel(option.label)' :for='formatLabel(option.label)'> {{ option.label }} </label>
                </div>
            </div> 
        </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: true,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false,
        }
    },
    props: ['modelValue', 'pattern', 'group', 'title', 'required', 'options', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField(inputValue) {

            this.fieldStatus.value = inputValue;  // remove this if issues occur

            // The field has been touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }

            // This erases the init value
            if(inputValue == undefined) {
                this.initValue != undefined ? inputValue = this.initValue : inputValue = ""; // Set init value or blank field
            }

            // Check field field is required or not.
            if(this.fieldRequired == true) {
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = "";
                    return this.fieldStatus;
                } else {
                    this.fieldStatus.invalid = false;
                    this.initValue != undefined ? inputValue = this.initValue : inputValue = ""; // Set init value or blank field
                    return this.fieldStatus;
                }
            } 
            else {
                this.fieldStatus.value = inputValue;
                this.fieldStatus.invalid = false;
                return this.fieldStatus;
            }

            // if(this.inputValue == undefined) {
            //     return this.fieldStatus;
            // }

           
        },
        fieldValue() {
            return this.fieldStatus.value;
        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }
            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus); // send data up to the parent. might not need this....
            this.$emit('emitValue', this.fieldStatus.value); 
        },
        formatLabel(label) {
            return label.toLowerCase().split(" ").join("_"); 
        }
    },
    computed: { },
    created() {

       

        // Set an init value if one is defined
        if(this.initValue != undefined) {
            this.fieldStatus.value = this.initValue;
        }
                
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}










/** 
* ====================================================================== 
* Radio Input Content Component (new)
* ======================================================================
*
* Radio input but with the ability to put content in the middle of it.
*
* 
*
* ========== HOW TO USE ==========
<radio-input-package
    title="Select a Package"
    ref="package_type" 
    v-model="formData.package_type"
    group="package"
    :required=true
    :options="[
        {'label': '100-plan', 'value': '$100 per month plan'},
        {'label': '175-plan', 'value': '$175 per month plan'},
        {'label': '250-plan', 'value': '$1250 per month plan'}
    ]">
</radio-input-package>
**/


export const RadioInputContent = {

    template: `
        <div class="radio__input-group-photo form__input-group">
            <h3> {{ title }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"> </span> </h3>

            <div class="promotion-plan-select__container">
                <div v-for="option in options">
                    <input type='radio' v-model='fieldStatus.value' :id='formatLabel(option.label)' :value='option.value' :name='group' @input='$emit("update:modelValue", checkField($event.target.value))' />
                    <label :label='formatLabel(option.label)' :for='formatLabel(option.label)'> 

                        <ul>
                            <p> {{ option.label }} </p>
                            <p> {{ option.value }} </p>
                            <p> Other content like an image or something </p>
                        </ul>

                    </label>
                </div> 
            </div>
        </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: true,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false,
        }
    },
    props: ['modelValue', 'pattern', 'group', 'title', 'required', 'options'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField(inputValue) {
             this.fieldStatus.value = inputValue; 
            

            // The field has been touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }

            // This erases the init value
            if(inputValue == undefined) {
                this.initValue != undefined ? inputValue = this.initValue : inputValue = ""; // Set init value or blank field
            }

            // Check field field is required or not.
            if(this.fieldRequired == true) {
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = "";
                    return this.fieldStatus;
                } else {
                    this.fieldStatus.invalid = false;
                    this.initValue != undefined ? inputValue = this.initValue : inputValue = ""; // Set init value or blank field
                    return this.fieldStatus;
                }
            } 
            else {
                this.fieldStatus.value = inputValue;
                this.fieldStatus.invalid = false;
                return this.fieldStatus;
            }

            // if(this.inputValue == undefined) {
            //     return this.fieldStatus;
            // }

           
        },
        fieldValue() {
            return this.fieldStatus.value;
        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }
            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        },
        formatLabel(label) {
            return label.toLowerCase().split(" ").join("_"); 
        }
    },
    computed: { },
    created() {
        
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}









/** 
* ====================================================================== 
* Checkbox Component
*
* This checkbox should only return true or false
* ======================================================================= 
**/



// WHat I want it to do. Validate based on regex
// Change the label
export const CheckboxInput = {

    template: `
    <div :class="['checkbox__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <input type="checkbox" v-model="fieldStatus.value" :id='formatLabel' :name='formatLabel' :maxlength="maxlength" :placeholder="placeholder" @change="checkField($event.target.checked)" />
        <label :label='formatLabel' :for='formatLabel'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> </label>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: false,
                invalid: true,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false,
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'placeholder', 'name', 'value', 'required', 'initValue'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField(inputValue) {

            var inputValue = this.fieldStatus.value;

            // Change here - Init value is set if init value is defined and the user hasent set an input
            if(this.initValue != undefined && inputValue == undefined) { 
                inputValue = this.initValue;
            }

            // Make sure value isn't undefined
            // if(inputValue == undefined || inputValue == false) {
            if(inputValue == undefined) {
                inputValue = false;
                this.fieldStatus.value = false;
            }

            // Field is touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }

            
            // Check field field is required or not.
            if(this.fieldRequired == true) {
                
                if(inputValue === "" || inputValue === undefined || inputValue === null || inputValue === false) {
                    this.fieldStatus.invalid = true;
                    //this.initValue != undefined ? this.fieldStatus.value = initValue : this.fieldStatus.invalid = true; // Set init value or blank field.
                    return this.fieldStatus;
                } 
                else {
                    this.fieldStatus.invalid = false;
                    this.initValue != undefined ? inputValue = this.initValue : inputValue = ""; // Set init value or blank field
                    return this.fieldStatus;
                }
            } 
            else {
                this.fieldStatus.value = inputValue;
                this.fieldStatus.invalid = false;

            }

            // If the checkbox uses a string as it's value, send the string value, else do a normal check
            if(this.checkboxIsStringValue) {
                inputValue ? this.fieldStatus.value = this.initValue : this.fieldStatus.value = "";

            } 
            else {
                inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue; // Prevent clearing value when first checked
                this.initValue != undefined ? this.fieldStatus.value = inputValue : this.fieldStatus.value = inputValue; // Change the checkbox value before sending.
                this.fieldStatus.value = inputValue;

            }

            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
            
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Check if Checkbox value prop is set
        if(typeof this.initValue != undefined) {

            if(typeof this.initValue != "boolean") {
                this.fieldStatus.value = true;
            } else {
                this.fieldStatus.value = this.initValue;
            }

        }

        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}




















/** 
* ====================================================================== 
* Checkbox Group
**
** 
* ======================================================================= 
**/
export const CheckboxGroup = {

    template: `
    <div :class="['checkbox-group__container', {'form__input-group-error' : checkInvalid()}]">

        <span> {{ label }} </span>
        
        <div class="checkbox-group__input-group-container">
            <div v-for="(option, index) in this.options" class="checkbox-group__input-group form__input-group">
                <input :key="index" type="checkbox" v-model="checkboxOptions[index].active" :id="formatName + index" @change="checkField($event.target, index)" />
                <label :for="formatName + index"> {{ option }} </label>
            </div>
        </div>

        <div class="checkbox-group__message-container"> 
            <span v-show="checkInvalid()" class="fa fa-exclamation-circle"> </span>
            <span> {{ fieldMessage }} </span> 
        </div>
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: [],
                invalid: false,
                label: this.label,
                fieldTouched: false,
                fieldSubmitted: false
            },
            checkboxOptions: [
                //{index: 0, active: false}
                //{index: 1, active: false}
                //{index: 2, active: false}
            ],
            fieldRequired: false,
            checkboxIsStringValue: false,
            fieldMessage: ""
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'placeholder', 'required', 'name', 'initValue', 'options','min','max'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    watch: {
        initValue(newValue, oldValue) {

            // Mark checkboxes as active if the init value is set
            for (let i = 0; i < this.checkboxOptions.length; i++) {
                if(newValue.indexOf(this.checkboxOptions[i].value) > -1) {
                    this.checkboxOptions[i].active = true;
                } else {
                    this.checkboxOptions[i].active = false;
                }
            }

            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
        }
    },
    methods: {
        checkField(checkVal, index) {

            // The field is touched
            this.fieldStatus.fieldTouched = true;


            if(checkVal.checked) {
                this.checkboxOptions[index].active = true;
            } else {
                this.checkboxOptions[index].active = false;
            }

            // Push items to FieldStatus Array
            var prepArray = [];
            for (let i = 0; i < this.checkboxOptions.length; i++) {
                if(this.checkboxOptions[i].active == true) {
                    prepArray.push(this.options[i]);
                }
            }

            this.fieldStatus.value = prepArray;

            // Checking min and max values
            if(this.min != undefined && this.max == undefined) {
                if(this.fieldStatus.value.length < this.min) {
                    this.fieldStatus.invalid = true;
                    this.fieldMessgae = "Select at least " + this.min
                } else {
                    this.fieldStatus.invalid = false;
                    this.fieldMessage = "";
                }
            }

            // If user selectes over the maximum value
            if(this.max != undefined && this.min == undefined) {
                if(this.fieldStatus.value.length > this.max) {
                    this.fieldStatus.invalid = true;
                    this.fieldMessage = "Select no more than " + this.max;
                } else {
                    this.fieldStatus.invalid = false;
                    this.fieldMessage = "";
                }
            }

            // If user selected over maxiumum value
            if(this.max != undefined && this.min != undefined) {
                if(this.fieldStatus.value.length > this.max) {
                    this.fieldStatus.invalid = true;
                    this.fieldMessage = "Select no more than " + this.max;
                } else if (this.fieldStatus.value.length < this.min) {
                    this.fieldStatus.invalid = true;
                    this.fieldMessgae = "Select at least " + this.min
                } else {
                    this.fieldStatus.invalid = false;
                    this.fieldMessage = "";
                }
            }

            // If the field is required.
            if(this.required != undefined && this.required) {
                if(this.fieldStatus.value.length == 0) {
                    this.fieldStatus.invalid = true;
                } 
            } 
            else {
                if(this.fieldStatus.value.length == 0) {
                    this.fieldStatus.invalid = false;
                }  
            }

            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus); // send data up to the parent. might not need this....
            this.$emit('emitValue', this.fieldStatus.value);
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_");
        },
        formatName() {
            // Converts input string into kebab-case is it has spaces.
            return this.name.toLowerCase().split(" ").join("_"); 
        },

    },
    created() {

        // Create Checkbox options
        for (let i = 0; i < this.options.length; i++) {
            this.checkboxOptions.push({
                index: i,
                active: false,
                value: this.options[i]
            })            
        }

        //Set init value
        if(this.initValue != undefined) {
            for (let i = 0; i < this.checkboxOptions.length; i++) {
                if(this.initValue.indexOf(this.checkboxOptions[i].value) > -1) {
                    this.checkboxOptions[i].active = true;
                }
            }

            this.fieldStatus.value = this.initValue;
        }

        // If the field is requied make the field invalid by default;
        if(this.required == true) {
            this.fieldStatus.invalid = true;
        } 
        else {
            this.fieldStatus.invalid = false;
        }
        
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}



















/** 
* ====================================================================== 
* Date Component / Calendar Component / Date Input
* ======================================================================= 
**/

// WHat I want it to do. Validate based on regex
// Change the label
export const DateInput = {

    template: `
    <div :class="['text__input-group', 'form__input-group', {'form__input-group-error' : checkInvalid()}]">
        <label :label='formatLabel' :for='formatLabel'> {{ label }} <span v-show="checkInvalid()" class="fa fa-exclamation-circle"></span> </label>
        <input type="date" :id='formatLabel' v-model="fieldStatus.value"  :name='formatLabel' :maxlength="maxlength" :placeholder="placeholder"  @change="checkField($event.target.value)" />
    </div>
    `,

    data() {
        return {
            fieldStatus: {
                value: '',
                invalid: true,
                fieldTouched: false,
                fieldSubmitted: false
            },
            fieldRequired: false
        }
    },
    props: ['modelValue', 'label', 'pattern', 'maxlength', 'initValue', 'placeholder', 'required', 'name'],
    emits: ['update:modelValue', 'updateForm', 'emitValue'],
    methods: {
        checkField() {
            // console.log(inputValue);

            var inputValue = this.fieldStatus.value;


            // Make sure value isn't undefined
            if(inputValue == undefined) {
                inputValue = "";
                this.fieldStatus.value = "";
            }

            // Field is touched
            if(inputValue) {
                this.fieldStatus.fieldTouched = true;
            }

            if(this.required == true) {

           

                // If requied and the field is blank
                if(inputValue == "") {
                    this.fieldStatus.invalid = true;
                    this.fieldStatus.value = inputValue;
                    this.$emit('update:modelValue', this.fieldStatus);
                    this.$emit('emitValue', this.fieldStatus.value);
                    return this.fieldStatus;
                }

                // If pattern (regular expression) prop is defined then check to make sure the input matches the pattern
                if(this.pattern != undefined) {

                    var rePattern = new RegExp(this.pattern, "i");
                    if(rePattern.test(inputValue)) {
    
                        this.fieldStatus.invalid = false;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } else if (inputValue == "") {
            
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    } 
                    else {
                        this.fieldStatus.invalid = true;
                        this.fieldStatus.value = inputValue;
                        this.$emit('update:modelValue', this.fieldStatus);
                        this.$emit('emitValue', this.fieldStatus.value);
                        return this.fieldStatus;
                    }
                }

                if(this.required == false || this.required == undefined) {
                    this.fieldStatus.invalid = false;
                    this.fieldStatus.value = inputValue;
                    $emit('update:modelValue', this.fieldStatus);
                    return this.fieldStatus;
                }
            } 

            // Prevent the input from clearing out when you first hit a button
            this.fieldStatus.invalid = false;
            inputValue == undefined ? this.fieldStatus.value = "" : this.fieldStatus.value = inputValue;

            
            //Convert date to LocaleString (mm/dd/yyyy)
            // No used, rather use other format
            // console.log(this.fieldStatus.value);
            // this.fieldStatus.value = new Date(this.fieldStatus.value).toLocaleDateString();


            // Send info to parent component (form);
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value);
            return this.fieldStatus;

        },
        checkInvalid() {
            // Check if field is invalid
            if(this.fieldStatus.invalid && this.fieldStatus.fieldTouched) {
                return true;
            }
            if(this.fieldStatus.invalid && this.fieldStatus.fieldSubmitted) {
                return true;
            }

            return false;
        },
        makeFieldSubmitted() {
            this.fieldStatus.fieldSubmitted = true;
        },
        makeFieldNotSubmitted() {
            this.fieldStatus.fieldSubmitted = false;
        },
        updateField(value) {
            this.fieldStatus.value = value;
            this.checkField();
        },
        clearField() {
            this.fieldStatus.value = '';
            this.pattern == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            // this.fieldRequired == undefined ? this.fieldStatus.invalid = false : this.fieldStatus.invalid = true;
            this.fieldStatus.fieldTouched = false;
            this.fieldStatus.fieldSubmitted = false;
            this.$emit('update:modelValue', this.fieldStatus);
            this.$emit('emitValue', this.fieldStatus.value); // send data up to the parent. might not need this....
        }
    },
    computed: {
        formatLabel() {
            // Converts input string into kebab-case is it has spaces.
            let str = this.label ?? "";
            return str.toLowerCase().split(" ").join("_"); 
        }
    },
    created() {

        // Set an init value if one is defined
        if(this.initValue != undefined) {

            if(this.initValue == 'today' || this.initValue == 'now') {
                this.fieldStatus.value = new Date().toISOString().split('T')[0];
            } else {
                this.fieldStatus.value = this.initValue;
            }
        }

        // Is the field required?
        this.required == undefined ? this.fieldRequired = false : this.fieldRequired = this.required;
        this.checkField();
        this.$emit('update:modelValue', this.fieldStatus);
        this.$emit('emitValue', this.fieldStatus.value);
    }
}

const Fields = {
    TextInput,
    PasswordInput,
    TextDropdownInput,
    FileInput,
    FileImageInput,
    MultiTextInput,
    FileInputTwoBeta,
    SelectInput,
    TextareaInput,
    RadioInput,
    CheckboxInput,
    CheckboxGroup,
    DateInput
}

export default Fields;