import { useState } from 'react';
import { View, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

const GET_POST_BY_ID = gql`
  query GetPostById($id: ID) {
    getPostById(id: $id) {
      _id
      content
      imgUrl
      author {
        username
        name
      }
      comments {
        content
        username
      }
      likes {
        username
      }
    }
  }
`;

const COMMENT_POST = gql`
  mutation CommentPost($postId: ID, $comment: CommentInput) {
    commentPost(postId: $postId, comment: $comment)
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID) {
    likePost(postId: $postId)
  }
`;

export function PostDetailScreen({ route }) {
  const [comment, setComment] = useState('');
  const postId = route.params?.post?._id || route.params?.postId;

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
    skip: !postId,
  });

  const [commentPost, { loading: commentLoading }] = useMutation(COMMENT_POST, {
    onCompleted: async () => {
      setComment('');
      await refetch();
      Alert.alert('Success', 'Comment added');
    },
    onError: (err) => Alert.alert('Comment Error', err.message),
  });

  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
    onCompleted: async () => {
      await refetch();
      Alert.alert('Success', 'Post liked');
    },
    onError: (err) => Alert.alert('Like Error', err.message),
  });

  const handleComment = () => {
    if (!comment.trim()) {
      Alert.alert('Validation', 'Comment is required');
      return;
    }

    commentPost({
      variables: {
        postId,
        comment: { content: comment.trim() },
      },
    });
  };

  const handleLike = () => {
    likePost({ variables: { postId } });
  };

  if (!postId) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <AppText variant="muted">Post ID not found.</AppText>
        </View>
      </ScreenWrapper>
    );
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <AppText variant="muted">Loading post detail...</AppText>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <AppText variant="body" style={styles.errorTitle}>
            Failed to load post detail
          </AppText>
          <AppText variant="muted">{error.message}</AppText>
          <AppButton title="Retry" type="secondary" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  const post = data?.getPostById;

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
        <AppText variant="heading">Post</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          Conversation
        </AppText>

        <View style={styles.card}>
          <AppText variant="body" style={styles.author}>
            @{post?.author?.username || 'unknown'}
          </AppText>

          <AppText variant="body" style={styles.content}>
            {post?.content || '-'}
          </AppText>

          {post?.imgUrl ? <Image source={{ uri: post.imgUrl }} style={styles.postImage} /> : null}

          <View style={styles.actionRow}>
            <View style={styles.actionItem}>
              <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
              <AppText variant="muted" style={styles.actionText}>
                {post?.comments?.length || 0}
              </AppText>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="heart-outline" size={16} color={colors.textMuted} />
              <AppText variant="muted" style={styles.actionText}>
                {post?.likes?.length || 0}
              </AppText>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="share-social-outline" size={16} color={colors.textMuted} />
            </View>
          </View>
        </View>

        <AppButton
          title={likeLoading ? 'Liking...' : 'Like Post'}
          onPress={handleLike}
          type="secondary"
        />

        <AppText variant="muted">Write a comment</AppText>
        <AppInput
          placeholder="Type your comment..."
          value={comment}
          onChangeText={setComment}
          multiline
          style={styles.commentInput}
        />
        <AppButton
          title={commentLoading ? 'Submitting...' : 'Comment Post'}
          onPress={handleComment}
        />

        <View style={styles.commentList}>
          <AppText variant="body" style={styles.commentTitle}>
            Latest comments
          </AppText>
          {(post?.comments || []).map((item, idx) => (
            <View key={`${item.username}-${idx}`} style={styles.commentItem}>
              <AppText variant="muted">@{item.username}</AppText>
              <AppText variant="body">{item.content}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flex: 1,
    gap: 10,
    paddingTop: 8,
    paddingBottom: 20,
  },
  subtitle: {
    marginTop: -2,
    marginBottom: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
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
  postImage: {
    width: '100%',
    height: 190,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: colors.bgSoft,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
  },
  commentInput: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
    color: colors.text,
  },
  commentList: {
    marginTop: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    gap: 8,
  },
  commentTitle: {
    fontWeight: '700',
  },
  commentItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    gap: 3,
  },
});
