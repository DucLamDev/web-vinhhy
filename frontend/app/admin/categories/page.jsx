import { TaxonomyManager } from "@/components/admin/cms/taxonomy-manager";

export default function AdminCategoriesPage() {
  return (
    <TaxonomyManager
      type="categories"
      title="Quản lý Categories"
      description="Tạo taxonomy dạng category để nhóm bài viết giống WordPress."
    />
  );
}
