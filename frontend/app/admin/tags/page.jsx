import { TaxonomyManager } from "@/components/admin/cms/taxonomy-manager";

export default function AdminTagsPage() {
  return (
    <TaxonomyManager
      type="tags"
      title="Quản lý Tags"
      description="Tạo tag để filter, SEO và liên kết nội dung linh hoạt hơn."
    />
  );
}
