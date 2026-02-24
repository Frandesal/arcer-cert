export type Student = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_entered: string;
  date_graduated: string;
  modules_completed: { title: string; count: number }[];
  created_at: string;
  updated_at: string;
};

export type StudentInsert = Omit<Student, "id" | "created_at" | "updated_at">;
export type StudentUpdate = Partial<Omit<Student, "id" | "created_at">>;

export type Announcement = {
  id: string;
  title: string;
  content: string;
  images: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type AnnouncementInsert = Omit<Announcement, "id" | "created_at" | "updated_at">;
export type AnnouncementUpdate = Partial<Omit<Announcement, "id" | "created_at">>;
