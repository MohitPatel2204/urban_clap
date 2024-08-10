export default interface userT {
  pk?: number;
  email: string;
  first_name: string;
  username: string;
  last_name: string;
  is_staff: boolean;
  contact: string;
  address: string;
  is_active?: boolean;
  profile: { profile_photo: string };
  notification?: Array<string>;
  is_superuser?: boolean;
  password?: string;
  password2?: string;
}
