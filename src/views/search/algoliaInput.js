// import * as React from 'react';
// import { connect } from 'react-redux';
// import algoliasearch from 'algoliasearch';
// const algolia = algoliasearch('LNYZYXHAO8', '80e0a14ba07b04e2443bd3acada4010e');

// type Props = {
//   index: string,
//   onResults: Function,
//   onError: Function,
//   onEmptyField: Function, // when user empty the field
//   placeholder: string,
//   filters: ?string,
// };

// class AlgoliaInput extends React.Component<Props> {
//   componentDidMount() {
//     this.algolia = algolia.initIndex(this.props.index);
//   }

//   onKeyUp = e => {
//     const {
//       currentUser,
//       filters,
//       onEmptyField,
//       onResults,
//       onError,
//     } = this.props;

//     if (e.target && e.target.value) {
//       if (currentUser && currentUser.id) {
//         algolia.setExtraHeader('X-Algolia-User-ID', currentUser.id);
//       }
//       this.algolia.search(
//         {
//           query: e.target.value,
//           filters: filters,
//         },
//         (err, content) => {
//           if (err && onError) {
//             onError(err);
//           }
//           if (content && onResults) {
//             onResults(content.hits);
//           }
//         }
//       );
//     } else if (onEmptyField) {
//       onEmptyField();
//     }
//   };

//   render() {
//     const { StyledComponent } = this.props;

//     return (
//       <StyledComponent
//         style={{ WebkitUserSelect: 'auto', userSelect: 'auto' }}
//         onKeyUp={this.onKeyUp}
//         placeholder={this.props.placeholder}
//         type="text"
//       />
//     );
//   }
// }

// const map = state => ({ currentUser: state.users.currentUser });
// export default connect(map)(AlgoliaInput);
