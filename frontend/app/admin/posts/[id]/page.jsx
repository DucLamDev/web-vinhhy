import { PostEditorShell } from "@/components/admin/cms/post-editor-shell";

export default async function EditPostPage({ params }) {
  return <PostEditorShell postId={(await params).id} />;
}
