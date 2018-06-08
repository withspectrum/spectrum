// @flow
import { Alert } from 'react-native';

type Props = {
  deleteHandler: Function,
  title: string,
  subtitle: string,
};

export default ({
  deleteHandler,
  title = 'Are you sure?',
  subtitle = 'Deleting this cannot be undone',
}: Props) => {
  return Alert.alert(title, subtitle, [
    { text: 'Delete', onPress: () => deleteHandler(), style: 'destructive' },
    { text: 'Cancel', style: 'cancel' },
  ]);
};
