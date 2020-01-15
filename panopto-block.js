const {registerBlockType} = wp.blocks; //Blocks API
const {
    ToggleControl,
} = wp.components; //Block inspector wrapper

registerBlockType('panopto-embed/panopto-block', {
    title: 'Panopto Media',
    icon: 'playlist-video',
    category: 'embed',
    attributes: {
        submitted: {type: 'string', default: "" }, // value can be "", checking, invalid, or valid
        url: {type: 'string', default: "" },
    },

    edit: function(props) {

        function updateUrl(event) {
            props.setAttributes({
                url: event.target.value,
                submitted: (props.attributes.submitted === 'valid') ? "": props.attributes.submitted // if marked as valid, remove that status since user put in a new url
            });
        }

        function isUrlValid(u_url) {
            let url = new URL(u_url);
            let valid = true;

            // hostname must be a subdomain of panopto.com
            if (!(url.hostname.toLowerCase().endsWith("panopto.com"))){
                valid = false;
            }
            const viewer = "/panopto/pages/viewer.aspx";
            // if user pasted in a video with viewer.aspx, rewrite it with embed.aspx
            if (url.pathname.toLowerCase().startsWith(viewer)){
                url.pathname = "/Panopto/pages/embed.aspx" + url.pathname.slice(viewer.length); // combine embed plus the part of the user url after viewer.aspx
                // note: Panopto must be capitalized. otherwise, it redirects which messes up our check.
                props.setAttributes({
                    url: url.toString()
                })
            } else if (!(url.pathname.toLowerCase().startsWith("/panopto/pages/embed.aspx"))){
                valid = false;
            }

            return valid;
        }

        /**
         * Sends an HTTP request to the specified url. If it exists and returns a 200 code,
         * set the status to valid.
         * @param url
         */
        function isUrlExist(url){
            let request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState === 4){
                    if (request.status.toString().startsWith('2')) { //2XX code means page exists
                        props.setAttributes({
                            submitted: "valid"
                        });
                    } else {
                        props.setAttributes({
                            submitted: "invalid"
                        });
                    }
                }
            };
            request.open("GET", url , true);
            request.send(null);
        }

        /**
         * Set the submitted flag, as long as the playlistID exists.
         * @param event
         */
        function formSubmit(event){
            event.preventDefault(); // don't actually submit the form
            if (props.attributes.url){
                if (isUrlValid(props.attributes.url)){
                    props.setAttributes({submitted: "checking"});
                    isUrlExist(props.attributes.url);
                } else {
                    props.setAttributes({submitted: "invalid"});
                }
            }
        }

        return (
             // if user has not submitted the id (or id is null), render the form. else, render the iframe inside the block
            React.createElement(
                "form",
                {
                    onSubmit: formSubmit
                },
                React.createElement(
                    "h3",
                    null,
                    "Panopto Media Embed"
                ),
                React.createElement(
                    "input",
                    {
                        type: "string",
                        value: props.attributes.url,
                        onChange: updateUrl,
                        name: "panoptoUrl"
                    }
                ),
                ((props.attributes.submitted === "checking") ?
                    React.createElement(
                        "span",
                        {
                            class: "checking"
                        },
                        "Checking url..."
                    )
                    : ""),
                ((props.attributes.submitted === "invalid") ?
                    React.createElement(
                        "span",
                        {
                            class: "error"
                        },
                        "Invalid url. Please enter a valid Panopto video or playlist embed url."
                    )
                    : ""),
                React.createElement(
                    "input",
                    {
                        type: "submit",
                        value: "Embed",
                        className: "components-button is-button is-default is-large"
                    },
                    null
                ),
                ((props.attributes.url && props.attributes.submitted === "valid")) ? (// after they click submit, remove the form elements and render the iframe inside the block.
                // note: the user must delete the block and re-add it if they want to embed a different playlist.
                    React.createElement(
                        "div",
                        null,

                        React.createElement(
                            "iframe",
                            {
                                src: props.attributes.url,
                                width: 720,
                                height: 405,
                                frameborder: 0,
                                allowfullscreen: true,
                                allow: 'autoplay'
                            }
                        )
                    )
                ) : (
                    React.createElement(
                        "div",
                        null,
                        "Enter a panopto video embed URL"
                    )
                )
            )
        )
    },

    save: function(props) {
        // this can simply return 'null', which tells wordpress to just save the input attributes.
        // however, by actually saving the html, this saves the html in the database as well, which means
        // that our plugin can be disabled and the old pages will still have iframe html. however, if an unprivileged
        // user edits that page, the iframe code will be stripped out upon saving.
        // due to the html filtering, this return is not strictly used, as the server-side render method overwrites
        // this when printing onto the page (but that allows us to print out raw html without filtering, regardless of user).
        return (props.attributes.mediaID && props.attributes.submitted) ? // only create the iframe if playlistID is defined and form is submitted
            (
                React.createElement(
                    "iframe",
                    {
                        src: props.attributes.url,
                        width: 720,
                        height: 405,
                        frameborder: 0,
                        allowfullscreen: true,
                        allow: 'autoplay'
                    }
                )
            ) : (
                null
            )
    }

});