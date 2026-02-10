Step-by-Step Solution: Implementing a Modal for Modal Links

This involves three main parts: setting up the modal, getting the content, and triggering the modal.

Area 1: Setting Up the Modal Component

1. Identify/Create a Modal Component:
    * Baby Step: You need a pop-up window component. You can use an existing one (like Congratulate) or create a new ModalLinkDialog (potentially using shadcn/Radix Dialog).
    * Action: This ModalLinkDialog needs to accept show (boolean), title (string), contentHTML (HTML string), and onClose (function) as props.

2. Add Modal State to `App.jsx`:
    * Baby Step: App.jsx needs to control the modal's visibility, title, and content.
    * Action: In src/App.jsx, add these to your this.state in the constructor:

        this.state = {
            // ... existing state ...
            showModalLinkDialog: false,       // Is the modal currently visible?
            modalLinkDialogTitle: '',         // Title for the modal header
            modalLinkDialogContentHTML: '',   // The HTML content for the modal body
        };

3. Create Modal Control Functions in `App.jsx`:
    * Baby Step: You need functions to open and close the modal.
    * Action: In src/App.jsx, define these methods:

        showModalLinkDialog = (title, contentHTML) => {
            this.setState({
                showModalLinkDialog: true,
                modalLinkDialogTitle: title,
                modalLinkDialogContentHTML: contentHTML,
            });
        };

        hideModalLinkDialog = () => {
            this.setState({
                showModalLinkDialog: false,
                modalLinkDialogTitle: '',
                modalLinkDialogContentHTML: '',
            });
        };

4. Render the Modal in `App.jsx`:
    * Baby Step: Place your ModalLinkDialog component in App.jsx's render method so it's always available to appear.
    * Action: Add your ModalLinkDialog near the top of the render method, inside the main app div:

        // Inside App.jsx render() method
        return (
            <div className="app ...">
                {/* ... other top-level components ... */}

                <ModalLinkDialog
                    show={showModalLinkDialog}
                    title={modalLinkDialogTitle}
                    contentHTML={modalLinkDialogContentHTML}
                    onClose={this.hideModalLinkDialog}
                />

                {/* ... rest of your App.jsx content ... */}
            </div>
        );

Area 2: Content Retrieval (Single Source of Truth)

5. Understand JSON Content Structure:
    * Baby Step: Identify where the explanation text is located in your config JSON (e.g., 1.json). For modal links like #tuvous, the explanation is likely in a property like infoTextHTML within a specific grammar section.
    * Action: Make a mental note of how a targetId (like tuvous) maps to a title and infoTextHTML within your this.state.config object.

6. Create a `findModalLinkContent` Utility in `App.jsx`:
    * Baby Step: This function will search your this.state.config object for the explanation based on the targetId from the modal link.
    * Action: Add this method to App.jsx. This will be the most complex part to customize based on your JSON's exact structure.

        findModalLinkContent = (targetId) => {
            const { config } = this.state;
            if (!config) return { title: 'Error', contentHTML: '<p>Content not loaded.</p>' };

            // --- CUSTOMIZE THIS TRAVERSAL LOGIC ---
            // Example: Find #tuvous in config.grammar.content[1].grammar2
            if (targetId === 'tuvous' && config.grammar?.content?.[1]?.grammar2) {
                const grammar2 = config.grammar.content[1].grammar2;
                return {
                    title: grammar2.titleText || 'Grammar Explanation', // Get title
                    contentHTML: grammar2.infoTextHTML || '<p>No explanation.</p>', // Get content
                };
            }
            // Add more 'if' blocks or a loop to find other targetIds
            // For example, if targetId is an 'id' on a component config object:
            for (const sectionKey in config) {
                const section = config[sectionKey];
                if (section.content && Array.isArray(section.content)) {
                    for (const item of section.content) {
                        const componentConfig = Object.values(item)[0]; // Assumes format { key: config_obj }
                        if (componentConfig?.id === targetId) {
                            return {
                                title: componentConfig.titleText || 'Explanation',
                                contentHTML: componentConfig.informationTextHTML || componentConfig.informationText || '<p>No info.</p>',
                            };
                        }
                    }
                }
            }
            // --- END CUSTOMIZATION ---

            return { title: 'Not Found', contentHTML: `<p>Explanation for ID "${targetId}" not found.</p>` };
        };

7. Enrich JSON for Highlighted Text:
    * Baby Step: To make specific words in the modal flash, you need to mark them in your source JSON.
    * Action: In your infoTextHTML strings within the JSON, wrap the words you want to highlight with a <span class='modal-highlight'>...</span> tag.
        * Example: "infoTextHTML": "When to use <span class='modal-highlight'>tu</span> versus <span class='modal-highlight'>vous</span>."
    * Action: Define CSS for the .modal-highlight class in src/index.css (or App.scss). Include a background-color for highlighting and a CSS @keyframes animation for the flashing effect.

Area 3: Triggering the Modal

8. Modify `handleModalLinkClick` (in `utility.js` and `App.jsx`):
    * Baby Step: Change the existing handleModalLinkClick (which causes scrolling) to instead call your showModalLinkDialog.
    * Action:
        * Update src/App.jsx's initialiseModalLinks to pass the new findModalLinkContent and showModalLinkDialog methods to handleModalLinkClick.
        * Modify utility.js's handleModalLinkClick to:
            * e.preventDefault(); (stop scrolling).
            * Extract targetId from href.
            * Call the findModalLinkContent callback with targetId.
            * Call the showModalLinkDialog callback with the retrieved title and contentHTML.
            * Remove or disable any old scroll and highlight logic.

9. Remove Old "Back to Link" Button:
    * Baby Step: The "Back to link" button is no longer needed since no scrolling occurs.
    * Action: Remove the IconButton with id="backToLinkButton" from App.jsx and any related scrollBack function calls.

---

This step-by-step guide will help you implement the modal solution, keeping your content centralized and improving the user experience.
