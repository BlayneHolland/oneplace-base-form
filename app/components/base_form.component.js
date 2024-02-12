/** 
* ====================================================================== 
* Form Component
* ======================================================================= 
**/

import Fields from './fields.component.js';
import Icons from './utilities/icons.component.js';
import Modal  from './utilities/modal.component.js';

export const BaseForm = {
    template: `
    <div class="sk-container base-form__component_container">

        <!-- Modal -->
        <modal ref="modal" :modalIsLocked="isSending" :disableScroll="true" :disableTopBar="true">
            <div class="form-modal-container">
                <h1 v-show="!isSending"> {{ statusMessage }} </h1>
                <h1 v-show="isSending"> Sending Message </h1>
                <icon v-show="isSending" iconName="mail" :spin="true" color="#0079c2"></icon>
                <button v-show="!isSending" class="form-modal-close" @click="$refs.modal.close()"> Close </button>
            </div>
        </modal>

        <div class="row">
            <text-input class="twelve columns" label="First Name" name="first_name" ref="first_name" v-model="formData.first_name" :required=true pattern="\\w+"> </text-input>
        </div>

        <div class="row">
            <text-input class="twelve columns" label="Last Name" name="last_name" ref="last_name" v-model="formData.last_name" :required=true pattern="\\w+"> </text-input>
        </div>

        <div class="row">
            <text-input class="twelve columns" label="Email" name="email" ref="email" v-model="formData.email" :required=true pattern="\\w+"> </text-input>
        </div>

        <div class="row">
            <div class="form__submit-section twelve-columns">
                <button type="button" class="form-submit-button" :disabled="isLoading" @click="submitForm(sendEmail)"> 
                    <span> Send </span> 
                </button>
                <icon iconName="spinner" :spin="true" v-show="isLoading" color="#0079c2"></icon> 
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            formData: {},
            session: {},
            formValid: false,
            isLoading: false,
            isSending: false,
            modalIsShown: false,
            hasRecaptcha: false,
            recaptchaValid: false,
            statusMessage: "",
            myinput: "",
            formMessageTimeout: setTimeout
        }
    },
    emits:['form-valid', 'status-message'],
    methods: {
        /**
         * Submit Form. *Required function*
         *
         * Check if the form is valid by checking the formData Object then runs the specified function if the form is valid.
         * The callback is usually
        */
        async submitForm(callback) {

            let formValid = await this.checkForm();
            
            // If form is valid, do something.
            if(formValid) {
                callback();
            } 
            else {
                console.log("form is invalid");
                return false;
            }
        },





        /**
         * Send Email
         * 
         * Send form data to a script that takes the data creates and email and sends it.
         *
        */
        sendEmail() {

            // Construct form data
            var postform = this.createFormdata();
            
            // Construcst fetch options
            var requestOptions = {
              method: 'POST',
              body: postform
            };
            
            // The form is loading
            this.statusMessage = "";
            this.isLoading = true;
            this.isSending = true;
            this.$refs.modal.open();

            
            // Make fetch request
            fetch('./app/mail/sendemail.php', requestOptions)
            .then(response => response.json())
            .then((result) => {

                console.log(result);

                this.isLoading = false;
                this.isSending = false;

                // If the email sent successfully
                if(result.status == "ok") {
                    // Clear the form.
                    this.showStatusMessage("Message Sent Successfully");
                    this.clearForm();                           
                } 
                else if(result.status == "error") {
                    this.showStatusMessage(result.message, 6000);
                }
            })
            .catch(err => console.log('error', err));
        },





        /**
         * Write to Database
         * 
         * Write form data to a database.
         * 
         */
        writeToDb() {

            // Construct form data
            var postform = this.createFormdata();
            
            // Construcst fetch options
            var requestOptions = {
              method: 'POST',
              body: postform
            };

            this.isLoading = true;

            fetch('./app/api/saveToDb.php', requestOptions)
            .then(res => res.json())
            .then(json => {

                this.isLoading = false;
    
                if(json.status == "ok") {
                    console.log("successfully written to database.");
                } else {
                    alert("unable to write to database");
                }
            })

        },





        /**
         * Check Form. *Required Function*
         *
         * Check if the form is valid by checking the formData Object then runs the specified function if the form is valid.
         * If there is a parent component, it lets the parent component know that its valid.
        */
        async checkForm() {
            var formValid = true;

            console.log("checking if fields are valid");
            for(let i in this.formData) {
                // Set the field as submitted.
                try {
                    this.$refs[i].makeFieldSubmitted();
                } catch (error) { 
                    throw("Input with name '" + i + "' does not have it's ref the same as its name");
                }

                if(this.formData[i].invalid) {
                    formValid = false;
                }
            };

            // Show Message if the form is invalid.
            if( formValid == false ) {
                this.formValid = false;
                this.showStatusMessage("Form Invalid, Please correct fields", 6000);
            }

            this.formValid = formValid;
            this.$emit('form-valid', formValid);
            return formValid;
        },





        /**
         * Clears the active form.
         *
         * Clears form by erasing all contents in form object then lets child components know to clear their data.
         * The child component must have the ref="" attribute that matches the v-model="" name used.
         */
        clearForm() {
            this.formData = {};
            for(let i in this.$refs) {

                if(i == "modal") continue; // Skip modal component (if it exists

                this.$refs[i].clearField(); // Calls child component clearField() method
            }
        },





        /**
         * Create Form Data Object. Required Function
         *
         * Take all data from formData object and turns it into a javascript FormData object to be sent via fetch.
         * 
         * @return {Object} FormData Object
        */
        createFormdata() {

            var postform = new FormData();

            for (let i in this.formData) {

                // debug;
                // console.log("adding " + i);


                // Add files from files array
                if(this.formData[i].type == "file") {
                    for (let fi = 0; fi < this.formData[i].value.length; fi++) {
                        console.log(this.formData[i].value[fi]);
                        postform.append(i+"["+fi+"]", this.formData[i].value[fi]);
                    }
                } 
                else {
                    // If its a regular input add the value to formData
                    postform.append(i, this.formData[i].value);
                }
            }

            return postform;
        },





        /**
         * Change status message of form
         *
         * Description. (use period)
         *
         * @param {string}   message           Message you want to show.
         * @param {int}   timeInMilliseconds    (optional) How long you want the message to show for
         * 
         */
        showStatusMessage(message, timeInMilliseconds) {

            clearTimeout(this.formMessageTimeout);
            

            // Shows message for a limited amount of time.
            this.statusMessage = message;

            if(timeInMilliseconds) {
                this.formMessageTimeout = setTimeout(() => {
                    this.statusMessage = ""
                }, timeInMilliseconds);
            }

        },





        /**
         * Session
         *
         * Description. Get the session
         *
         */
        getSession() {

            // Get session data and fill in the form.
            fetch("./app/api/session.json.php")
            .then(res => res.json())
            .then(json => {

                if(json.status == "ok") {
                    this.session = json.data;
                }

              // this.$refs.first_name.fieldStatus.value = "John Doe";
              // this.$refs.first_name.checkField();
            })

        }

    },
    created() {

    },
    components: {
        'text-input': Fields.TextInput,
        'textarea-input': Fields.TextareaInput,
        'select-input': Fields.SelectInput,
        'checkbox-input': Fields.CheckboxInput,
        'checkbox-group': Fields.CheckboxGroup,
        'radio-input': Fields.RadioInput,
        'file-input': Fields.FileInput,
        'date-input': Fields.DateInput,
        'icon': Icons,
        'modal': Modal
    }
}