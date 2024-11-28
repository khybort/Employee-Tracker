export interface Attendance {
  date: string;
  entryTime: string;
  exitTime: string;
}

export interface AttendanceData {
  id: number;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  late_duration: string | null;
  employee: {
    id: number;
    full_name: string;
    position: string;
  };
}
