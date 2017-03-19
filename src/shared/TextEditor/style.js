import styled from 'styled-components';
import React from 'react';

export const Wrapper = styled.div`
	cursor: text;
	background: #fff;

	.DraftEditor-editorContainer,.DraftEditor-root,.public-DraftEditor-content{height:inherit;text-align:initial}.public-DraftEditor-content[contenteditable=true]{-webkit-user-modify:read-write-plaintext-only}.DraftEditor-root{position:relative}.DraftEditor-editorContainer{background-color:rgba(255,255,255,0);border-left:.1px solid transparent;position:relative;z-index:1}.public-DraftEditor-block{position:relative}.DraftEditor-alignLeft .public-DraftStyleDefault-block{text-align:left}.DraftEditor-alignLeft .public-DraftEditorPlaceholder-root{left:0;text-align:left}.DraftEditor-alignCenter .public-DraftStyleDefault-block{text-align:center}.DraftEditor-alignCenter .public-DraftEditorPlaceholder-root{margin:0 auto;text-align:center;width:100%}.DraftEditor-alignRight .public-DraftStyleDefault-block{text-align:right}.DraftEditor-alignRight .public-DraftEditorPlaceholder-root{right:0;text-align:right}.public-DraftEditorPlaceholder-root{color:#9197a3;position:absolute;z-index:0}.public-DraftEditorPlaceholder-hasFocus{color:#bdc1c9}.DraftEditorPlaceholder-hidden{display:none}.public-DraftStyleDefault-block{position:relative;white-space:pre-wrap}.public-DraftStyleDefault-ltr{direction:ltr;text-align:left}.public-DraftStyleDefault-rtl{direction:rtl;text-align:right}.public-DraftStyleDefault-listLTR{direction:ltr}.public-DraftStyleDefault-listRTL{direction:rtl}.public-DraftStyleDefault-ol,.public-DraftStyleDefault-ul{margin:16px 0;padding:0}.public-DraftStyleDefault-depth0.public-DraftStyleDefault-listLTR{margin-left:1.5em}.public-DraftStyleDefault-depth0.public-DraftStyleDefault-listRTL{margin-right:1.5em}.public-DraftStyleDefault-depth1.public-DraftStyleDefault-listLTR{margin-left:3em}.public-DraftStyleDefault-depth1.public-DraftStyleDefault-listRTL{margin-right:3em}.public-DraftStyleDefault-depth2.public-DraftStyleDefault-listLTR{margin-left:4.5em}.public-DraftStyleDefault-depth2.public-DraftStyleDefault-listRTL{margin-right:4.5em}.public-DraftStyleDefault-depth3.public-DraftStyleDefault-listLTR{margin-left:6em}.public-DraftStyleDefault-depth3.public-DraftStyleDefault-listRTL{margin-right:6em}.public-DraftStyleDefault-depth4.public-DraftStyleDefault-listLTR{margin-left:7.5em}.public-DraftStyleDefault-depth4.public-DraftStyleDefault-listRTL{margin-right:7.5em}.public-DraftStyleDefault-unorderedListItem{list-style-type:square;position:relative}.public-DraftStyleDefault-unorderedListItem.public-DraftStyleDefault-depth0{list-style-type:disc}.public-DraftStyleDefault-unorderedListItem.public-DraftStyleDefault-depth1{list-style-type:circle}.public-DraftStyleDefault-orderedListItem{list-style-type:none;position:relative}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listLTR:before{left:-36px;position:absolute;text-align:right;width:30px}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listRTL:before{position:absolute;right:-36px;text-align:left;width:30px}.public-DraftStyleDefault-orderedListItem:before{content:counter(ol0) ". ";counter-increment:ol0}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth1:before{content:counter(ol1) ". ";counter-increment:ol1}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth2:before{content:counter(ol2) ". ";counter-increment:ol2}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth3:before{content:counter(ol3) ". ";counter-increment:ol3}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth4:before{content:counter(ol4) ". ";counter-increment:ol4}.public-DraftStyleDefault-depth0.public-DraftStyleDefault-reset{counter-reset:ol0}.public-DraftStyleDefault-depth1.public-DraftStyleDefault-reset{counter-reset:ol1}.public-DraftStyleDefault-depth2.public-DraftStyleDefault-reset{counter-reset:ol2}.public-DraftStyleDefault-depth3.public-DraftStyleDefault-reset{counter-reset:ol3}.public-DraftStyleDefault-depth4.public-DraftStyleDefault-reset{counter-reset:ol4}

	> .public-DraftEditor-content {
		min-height: 1em;
	}

	.draftJsMentionPlugin__mention__29BEd, .draftJsMentionPlugin__mention__29BEd:visited {
  color: #575f67;
  cursor: pointer;
  display: inline-block;
  background: #e6f3ff;
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 2px;
  text-decoration: none;
}

.draftJsMentionPlugin__mention__29BEd:hover, .draftJsMentionPlugin__mention__29BEd:focus {
  color: #677584;
  background: #edf5fd;
  outline: 0; /* reset for :focus */
}

.draftJsMentionPlugin__mention__29BEd:active {
  color: #222;
  background: #455261;
}
.draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm {
  padding: 7px 10px 3px 10px;
  -webkit-transition: background-color 0.4s cubic-bezier(.27,1.27,.48,.56);
  transition: background-color 0.4s cubic-bezier(.27,1.27,.48,.56);
}

.draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm:active {
  background-color: #cce7ff;
}

.draftJsMentionPlugin__mentionSuggestionsEntryFocused__3LcTd {
  background-color: #e6f3ff;
}

.draftJsMentionPlugin__mentionSuggestionsEntryText__3Jobq {
  display: inline-block;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 368px;
  font-size: 0.9em;
  margin-bottom: 0.2em;
}

.draftJsMentionPlugin__mentionSuggestionsEntryAvatar__1xgA9 {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 12px;
}
.draftJsMentionPlugin__mentionSuggestions__2DWjA {
  border: 1px solid #eee;
  margin-top: -10em;
  position: absolute;
  min-width: 220px;
  max-width: 440px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 4px 30px 0px rgba(220,220,220,1);
  cursor: pointer;
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 2;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
          flex-direction: column;
  box-sizing: border-box;
  -webkit-transform: scale(0);
          transform: scale(0);
}
`;
