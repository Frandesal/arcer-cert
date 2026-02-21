export type Student = {
  id: string;
  full_name: string;
  date_entered: string;
  date_graduated: string;
  modules_completed: string[];
  created_at: string;
  updated_at: string;
};

export type StudentInsert = Omit<Student, "id" | "created_at" | "updated_at">;
export type StudentUpdate = Partial<Omit<Student, "id" | "created_at">>;
