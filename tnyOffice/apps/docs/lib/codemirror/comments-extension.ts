import { 
  Decoration,
  DecorationSet,
  EditorView
} from '@codemirror/view';
import { StateField, StateEffect, RangeSetBuilder, Transaction } from '@codemirror/state';
import { Comment } from '../types/comment';

// Effect to update comments
export const setCommentsEffect = StateEffect.define<Comment[]>();

// Effect to set active comment
export const setActiveCommentEffect = StateEffect.define<string | null>();

// Decoration mark for commented text
const commentMark = Decoration.mark({
  class: 'cm-comment-highlight',
  attributes: { title: 'Click to view comment' }
});

// Decoration mark for active comment
const activeCommentMark = Decoration.mark({
  class: 'cm-comment-highlight-active',
  attributes: { title: 'Active comment' }
});

// Combined state to track both comments and active comment
interface CommentsState {
  comments: Comment[];
  activeCommentId: string | null;
}

// State field to track comments and their decorations
export const commentsField = StateField.define<CommentsState>({
  create() {
    return { comments: [], activeCommentId: null };
  },
  
  update(state: CommentsState, tr: Transaction) {
    let newState = state;
    
    // Check for effects
    for (const effect of tr.effects) {
      if (effect.is(setCommentsEffect)) {
        newState = { ...newState, comments: effect.value };
      } else if (effect.is(setActiveCommentEffect)) {
        newState = { ...newState, activeCommentId: effect.value };
      }
    }
    
    return newState;
  }
});

// Decoration field that uses the comments state
export const commentDecorations = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  
  update(decorations: DecorationSet, tr: Transaction) {
    const state = tr.state.field(commentsField);
    const builder = new RangeSetBuilder<Decoration>();
    
    // Sort comments by start position to build decorations properly
    const sortedComments = [...state.comments].sort((a, b) => {
      const aStart = a.resolvedStart ?? a.anchorStart;
      const bStart = b.resolvedStart ?? b.anchorStart;
      return aStart - bStart;
    });
    
    for (const comment of sortedComments) {
      // Skip orphaned comments
      if (comment.status === 'orphaned') {
        continue;
      }
      
      // Use resolved positions if available, otherwise fall back to original positions
      const start = comment.resolvedStart ?? comment.anchorStart;
      const end = comment.resolvedEnd ?? comment.anchorEnd;
      
      // Ensure positions are within document bounds
      const boundedStart = Math.max(0, Math.min(start, tr.newDoc.length));
      const boundedEnd = Math.max(boundedStart, Math.min(end, tr.newDoc.length));
      
      if (boundedStart < boundedEnd) {
        // Use active comment mark if this is the active comment
        const mark = comment.id === state.activeCommentId ? activeCommentMark : commentMark;
        builder.add(boundedStart, boundedEnd, mark);
      }
    }
    
    return builder.finish();
  },
  
  provide: (field: StateField<DecorationSet>) => EditorView.decorations.from(field)
});

// Theme for comment highlights
export const commentTheme = EditorView.theme({
  '.cm-comment-highlight': {
    backgroundColor: '#ffeb3b4d',
    borderBottom: '2px solid #fbc02d',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#ffeb3b66'
    }
  },
  '.cm-comment-highlight-active': {
    backgroundColor: '#3b82f633',
    borderBottom: '2px solid #3b82f6',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#3b82f64d'
    }
  }
});

// Helper to update comments in the editor
export function updateComments(view: EditorView, comments: Comment[]) {
  view.dispatch({
    effects: setCommentsEffect.of(comments)
  });
}

// Helper to update active comment
export function updateActiveComment(view: EditorView, commentId: string | null) {
  view.dispatch({
    effects: setActiveCommentEffect.of(commentId)
  });
}