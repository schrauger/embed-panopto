const {registerBlockType} = wp.blocks; //Blocks API
const {
    ToggleControl,
} = wp.components; //Block inspector wrapper

registerBlockType('panopto-embed/panopto-block', {
    title: 'Panopto Media',
    icon: 'playlist-video',
    category: 'embed',
    attributes: {
        mediaID: {type: 'string', default: ""},
        submitted: {type: 'boolean', default: false },
        subdomain: {type: 'string', default: "" },
        url: {type: 'string', default: "" },
        isPlaylist: {type: 'boolean', default: false}
    },

    edit: function(props) {

        /**
         * Save playlist id in state. Unset the submitted flag.
         * @param event
         */
        function updateMediaID(event) {
            let mediaID = event.target.value;

            mediaID = mediaID.replace(/[^a-f0-9-]/gi, '');
            props.setAttributes({
                mediaID: mediaID,
                submitted: false // if the user edits the pid, unsubmit it - that way, they can edit it and not constantly see render errors
            });
            updateUrl({mediaID: mediaID});
        }

        function updateSubdomain(event) {
            let subdomain = event.target.value;

            subdomain = subdomain.replace(/[^a-z0-9-.]/gi, '');
            props.setAttributes({
                subdomain: subdomain,
                submitted: false
            });
            updateUrl({subdomain: subdomain});
        }

        function updateUrl(url_parts) {
            let subdomain = props.attributes.subdomain;
            if (typeof url_parts.subdomain !== 'undefined') {
                subdomain = url_parts.subdomain
            }
            if (subdomain && (subdomain.slice(-1) !== '.')) {
                subdomain += '.';
            }

            let mediaID = props.attributes.mediaID;
            if (typeof url_parts.mediaID !== 'undefined') {
                mediaID = url_parts.mediaID
            }

            let isPlaylist = props.attributes.isPlaylist;
            if (typeof url_parts.isPlaylist !== 'undefined') {
                isPlaylist = url_parts.isPlaylist
            }

            let $url = "https://" + subdomain + "panopto.com/Panopto/Pages/Embed.aspx";
            if (isPlaylist === true) {
                $url += "?pid=" + mediaID + "&v=1";
            } else {
                $url += "?id=" + mediaID + "&v=1";

            }
            props.setAttributes({
                url: $url,
            });


        }

        function updateIsPlaylist(toggle_value) {
            console.log(toggle_value);
            props.setAttributes({
                isPlaylist: toggle_value
            });
            updateUrl({isPlaylist: toggle_value})
        }

        /**
         * Set the submitted flag, as long as the playlistID exists.
         * @param event
         */
        function formSubmit(event){
            console.log('submitting');
            event.preventDefault(); // don't actually submit the form
            if (props.attributes.mediaID){
                props.setAttributes({submitted: true}) // rerender the attributes with the embed instead of the form
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
                    "span",
                    null,
                    props.attributes.url,
                ),
                React.createElement(
                    "hr",
                    null,
                    null,
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        {
                            for: 'subdomain'
                        },
                        "Subdomain"
                    ),
                    React.createElement(
                        "input",
                        {
                            type: "string",
                            value: props.attributes.subdomain,
                            onChange: updateSubdomain,
                            name: "panoptoSubdomain"
                        }
                    ),
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        {
                            for: 'panoptoMediaID'
                        },
                        "Media ID"
                    ),
                    React.createElement(
                        "input",
                        {
                            type: "string",
                            value: props.attributes.mediaID,
                            onChange: updateMediaID,
                            name: "panoptoMediaID"
                        }
                    ),
                ),
                React.createElement(
                    ToggleControl,
                    {
                        label: (props.attributes.isPlaylist ? 'Playlist' : 'Video'),
                        checked: props.attributes.isPlaylist,
                        onChange: updateIsPlaylist,
                        help: props.attributes.isPlaylist ? 'Media type: Playlist' : 'Media type: Video'
                    }
                ),
                React.createElement(
                    "input",
                    {
                        type: "submit",
                        value: "Embed",
                        className: "components-button is-button is-default is-large"
                    }
                ),

                ((props.attributes.mediaID && props.attributes.submitted)) ? (// after they click submit, remove the form elements and render the iframe inside the block.
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
                        "Enter a media ID and click embed"
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