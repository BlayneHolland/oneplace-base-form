/**
 * Modal Component
 * Version 0.04 - Last updated: 2/9/2024
 * 
 * Description: Modal Component. Those popups that overalys over the entire page.
 *
 * Author: blayne.jpg
 *
 */

const Modal = {
	template: `
  <div class="modal-component-container" v-show="modalIsShown" ref="modalComponentContainer" style="position: fixed; display: flex; align-items: center; justify-content: center; top: 10px; left: 0px; width: 100%; height: 100%; box-sizing: border-box; padding: 50px 0px; opacity: 0; transform: translateY(-10px); z-index: 1">

      <div @click="close()" ref="modalBackground" class="modal-component__background"  style="position: absolute; transition: 0.2s ease; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #0000008a; z-index: 10; opacity: 0"> </div>

      <div ref="mainContent" class="modal-component__content-container" style="background-color: white;padding: 20px 0px;border-radius: 10px;max-width: 650px; max-height: 100%;box-sizing: border-box;width: 100%;display: grid;grid-template-rows: 1fr minmax(auto, 100%); z-index: 20;transition: all 0.2s ease 0s;position: relative;box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;transform: translateY(-10px)">
          <div class="modal-component__header" style="display: flex;flex-end: space-between;align-items: center;padding: 0px 20px 20px;">
            <span @click="close()" class="modal-component-x-button" style="background: #e8e8ed; border-radius: 50%; color: #6e6e73; display: flex; align-items: center; justify-content: center; height: 26px; width: 26px; outline: none; position: relative;">
              <svg width="21" height="21" aria-hidden="true">
                  <path fill="none" d="M0 0h21v21H0z"></path>
                  <path transform="scale(0.75, 0.75) translate(3.4, 3.9)" d="m12.12 10 4.07-4.06a1.5 1.5 0 1 0-2.11-2.12L10 7.88 5.94 3.81a1.5 1.5 0 1 0-2.12 2.12L7.88 10l-4.07 4.06a1.5 1.5 0 0 0 0 2.12 1.51 1.51 0 0 0 2.13 0L10 12.12l4.06 4.07a1.45 1.45 0 0 0 1.06.44 1.5 1.5 0 0 0 1.06-2.56Z"></path>
              </svg>
            </span>
          </div>
          <div class="modal-component__main-content" style="background-color: white; padding: 0px 20px; overflow-y: auto; height: 100%; box-sizing: border-box;">
              <slot></slot>
          </div>
      </div>
  </div>
  `,
  props: ["timeout", "title", "modalIsOpen", "modalIsLocked", "disableScroll"],
  emits: ["on-modal-close", "on-modal-open"],
  watch: {
    modalIsOpen(newValue, oldValue) {
      if(newValue == true) {
        this.open();
      }
      else {
        this.close();
      }
    }
  },
	data() {
    return {
        modalIsShown: false,
        timeoutId: "",
        currentContentScrollPosition: 0,
        modalContentHeight: 0,
        maxScrollPosition: 100
    }
  },
  methods: {
  
    open() {
    
      let self = this; // Reach the the inside of functions.
      let browserWindowHeight = window.innerHeight;
      let modalHeight = this.$refs.mainContent.offsetHeight;
      
      // prevent scrolling on the body
      document.body.style.overflow = "hidden";

      this.$emit('on-modal-open');
      
      if(this.timeout != undefined) {
        timeout = this.timeout;
      }
      clearTimeout(this.timeoutId);

      self.$refs.modalComponentContainer.style.display = "flex";

      this.modalIsShown = true;
      
      //faux fade in top animation
     	setTimeout(function() {

      	self.$refs.modalComponentContainer.style.opacity = 1;
        self.$refs.modalBackground.style.opacity = 1;


        // This if statement is no longer used. Maybe delete it?
        if(modalHeight > browserWindowHeight) {
          self.$refs.mainContent.style.transform = "translateY(250px)";
        }

        self.$refs.mainContent.style.transform = "translateY(0px)";

      }, 5);
      
      if(this.timeout != undefined) {
        this.timeoutId = setTimeout(function() {
        	self.closePopup();
      	}, timeout);  
      }

 	},




    handleScroll(event) {

        // This function no longer used
        // Possably Erase this entire function
        // It was a means to make the entire modal scroll but I decided to make the modal have an inner scroll
        
        let mainContentElement = this.$refs.mainContent;
        let browserWindowHeight = window.innerHeight;
        let modalHeight = mainContentElement.offsetHeight;
        let modalMinPosition = 0;
        let modalMaxPosition = 0;
        
        console.log(event);
        console.log(mainContentElement.offsetHeight);
        console.log(window.innerHeight);

        
        /* When scrolling down*/
        if (event.deltaY > 0) {

            // Set the modal max and min scroll position
            if(modalHeight > browserWindowHeight) {
                modalMaxPosition = modalHeight + (modalHeight - browserWindowHeight);
                modalMaxPosition = 150;
            }

            if(this.currentContentScrollPosition > modalMaxPosition) {
                this.currentContentScrollPosition = modalMaxPosition;
            }

            // Scrolling down
            this.currentContentScrollPosition = this.currentContentScrollPosition + 100;
            mainContentElement.style.transform = "translateY("+this.currentContentScrollPosition+"px)";

            console.log('Scroll Position: ' + this.currentContentScrollPosition );
            console.log('Scroll Position: ' + this.currentContentScrollPosition );
            
        }

        
        /* When scrolling up [ x ] */
        else if (event.deltaY < 0) {

            if(modalHeight > browserWindowHeight) {
                modalMinPosition = 0 - (modalHeight - browserWindowHeight);
            }

            console.log("modal Min position");
            console.log(modalMinPosition);


            this.currentContentScrollPosition = this.currentContentScrollPosition - 100;

            if(this.currentContentScrollPosition < modalMinPosition) {
                this.currentContentScrollPosition = modalMinPosition;
            }

            mainContentElement.style.transform = "translateY("+this.currentContentScrollPosition+"px)";

            // Scrolling up
            console.log('Scrolling up');
            console.log('Scroll Position: ' + this.currentContentScrollPosition );


        }
    },





    // Close and clear the message popup.
    close() {

      let self = this; // Reach the inside of functions...

      // If the modal is locked, don't close it.
      if(this.modalIsLocked) {
        return;
      }

      clearTimeout(this.timeoutId);

      // allow scrolling on the body
      document.body.style.overflow = "auto";

      this.$refs.modalComponentContainer.style.opacity = 0;
      this.$refs.modalBackground.style.opacity = 0;
      this.$refs.modalComponentContainer.style.transform = "translateY(-10px)";
      this.$refs.mainContent.style.transform = "translateY(-10px)";

      this.$emit('on-modal-close');

      //faux fade in top
      setTimeout(function() {
        
      	self.$refs.modalComponentContainer.style.opacity = 0;
        self.$refs.modalBackground.style.opacity = 0;


        self.$refs.mainContent.style.transform = "translateY(-10px)";

      }, 5);

      setTimeout(function() {
          self.modalIsShown = false;
      }, 200);

    },  
  },
  created() {},
  mounted() {

    // Open modal by default
    if(this.modalIsOpen) {
      this.open();
    }

    // disable scrolling on the body
    if(this.disableScroll == true) {
      document.querySelector(".modal-component__main-content").style.overflow = "hidden";
    }

  }
}

export default Modal