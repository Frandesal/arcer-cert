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
