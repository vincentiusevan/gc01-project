import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

export function PostDetailScreen({ route }) {
  const [comment, setComment] = useState('');
  const post = route.params?.post;

  const handleComment = () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment is required');
      return;
    }

    Alert.alert('Success', `Comment submitted: ${comment}`);
    setComment('');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="heading">Post Detail</AppText>

        <View style={styles.card}>
          <AppText variant="body" style={styles.author}>
            @{post?.username || '-'}
          </AppText>
          <AppText variant="body" style={styles.content}>
            {post?.content || 'No post selected'}
          </AppText>
          <View style={styles.metaRow}>
            <AppText variant="muted">❤ {post?.likes ?? 0}</AppText>
            <AppText variant="muted">💬 {post?.comments ?? 0}</AppText>
          </View>
        </View>

        <AppText variant="muted">Write a comment</AppText>
        <AppInput
          placeholder="Type your comment..."
          value={comment}
          onChangeText={setComment}
          multiline
          style={styles.commentInput}
        />
        <AppButton title="Comment Post" onPress={handleComment} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingTop: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  author: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  content: {
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
  },
  commentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
