export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFormData {
  title: string;
  description: string;
}

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
  initialData?: TodoFormData;
  isEditing?: boolean;
}
