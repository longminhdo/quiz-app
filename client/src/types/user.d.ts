// createdAt: '1970-01-20T13:21:30.839Z';
// departmentId: '-1';
// email: 'ngoc.tb184299@sis.hust.edu.vn';
// hustId: '5794218312204288';
// refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpdiI6IjRiMDc1OWU5NzllMmY2ZjJkZDllZDkxNTBiNzQwNzhmIiwiZW5jcnlwdGVkRGF0YSI6ImZiMThiNzQ4NGNlY2ZmYzRlOTg5MmU2NDg4ZGZiYjE4NDcyYzk3NzcwNjM4YmNlN2NlODQ1ZjBlODYxODQ1NTEiLCJpYXQiOjE2OTAyMjQzNDMsImV4cCI6MTY5MDgyOTE0M30.utLrSPET2G1xEmOO3BN-97jFa6JLByo2amza_wPlgbA';
// role: 'student';
// studentId: '20184299';
// updatedAt: '1970-01-20T13:30:24.344Z';
// __v: 0;
// _id: '64b6a2d7e078062ea6f176e1';

export interface User {
  createdAt: number;
  __v: number;
  _id: string;
  departmentId: string;
  hustId: string;
  email: string;
  role: string;
  updatedAt: string;
  studentId: string;
}
