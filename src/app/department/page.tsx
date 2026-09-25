import { redirect } from 'next/navigation';

export default function DepartmentSingularRedirect() {
  redirect('/departments');
}