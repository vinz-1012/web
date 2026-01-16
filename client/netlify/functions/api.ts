import type { Config, Context } from "@netlify/functions";
import { getDeployStore, getStore } from "@netlify/blobs";

type ClassItem = {
  id: number;
  code: string;
  subject: string;
  requirement: string;
  schedule: string;
  salary: string;
  address: string;
  status: boolean;
  createdAt: string;
};

type UserRecord = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  subjects: string;
  area: string;
  note: string;
  registeredClasses: string[];
  role?: "user" | "admin";
};

const defaultClasses = (): ClassItem[] => [
  {
    id: 1,
    code: "MSTT2971",
    subject: "Toan lop 9",
    requirement: "Giao vien nu",
    schedule: "3 buoi/tuan, toi sap xep",
    salary: "Thoa thuan (1h30'/buoi)",
    address: "Duong so 8, Linh Dong, Thu Duc",
    status: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    code: "MSTT2970",
    subject: "Khieu vu nguoi lon",
    requirement: "Giao vien nu",
    schedule: "3 buoi/tuan, sang thu 2-4-6",
    salary: "Thoa thuan (1h/buoi)",
    address: "Le Van Luong, Nha Be",
    status: true,
    createdAt: new Date().toISOString()
  }
];

const getBlobStore = () => {
  const deployContext = Netlify.context?.deploy?.context;
  if (deployContext === "production") {
    return getStore("tutor-finder", { consistency: "strong" });
  }
  return getDeployStore("tutor-finder");
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });

const parseJsonBody = async (req: Request) => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};

const readClasses = async (store: ReturnType<typeof getBlobStore>) => {
  const data = await store.get("classes", { type: "json" });
  if (Array.isArray(data)) {
    return data as ClassItem[];
  }
  const seed = defaultClasses();
  await store.setJSON("classes", seed);
  return seed;
};

const writeClasses = async (
  store: ReturnType<typeof getBlobStore>,
  classes: ClassItem[]
) => {
  await store.setJSON("classes", classes);
};

const readUsers = async (store: ReturnType<typeof getBlobStore>) => {
  const data = await store.get("users", { type: "json" });
  if (Array.isArray(data)) {
    return data as UserRecord[];
  }
  const seed: UserRecord[] = [];
  await store.setJSON("users", seed);
  return seed;
};

const writeUsers = async (
  store: ReturnType<typeof getBlobStore>,
  users: UserRecord[]
) => {
  await store.setJSON("users", users);
};

const normalizePath = (pathname: string) => {
  if (pathname === "/api") {
    return "/";
  }
  if (pathname.startsWith("/api/")) {
    return pathname.slice(4);
  }
  return pathname;
};

export default async (req: Request, _context: Context) => {
  const { method } = req;
  const url = new URL(req.url);
  const path = normalizePath(url.pathname);
  const store = getBlobStore();

  if (path === "/" && method === "GET") {
    return jsonResponse({ message: "Tutor Finder API is running" });
  }

  if (path === "/health" && method === "GET") {
    return jsonResponse({ status: "ok", timestamp: new Date().toISOString() });
  }

  if (path === "/classes" && method === "GET") {
    const classes = await readClasses(store);
    const active = classes.filter((cls) => cls.status);
    return jsonResponse(active);
  }

  if (path === "/classes/admin" && method === "GET") {
    const classes = await readClasses(store);
    return jsonResponse(classes);
  }

  if (path === "/classes" && method === "POST") {
    const body = await parseJsonBody(req);
    const { code, subject, requirement, schedule, salary, address, status } =
      body || {};

    if (!code || !subject || !requirement || !schedule || !salary || !address) {
      return jsonResponse(
        { message: "Thieu thong tin lop hoc bat buoc." },
        400
      );
    }

    const classes = await readClasses(store);
    const newId = classes.length
      ? Math.max(...classes.map((cls) => cls.id)) + 1
      : 1;

    const newClass: ClassItem = {
      id: newId,
      code,
      subject,
      requirement,
      schedule,
      salary,
      address,
      status: typeof status === "boolean" ? status : true,
      createdAt: new Date().toISOString()
    };

    classes.push(newClass);
    await writeClasses(store, classes);
    return jsonResponse(newClass, 201);
  }

  const classIdMatch = path.match(/^\/classes\/(\d+)$/);
  if (classIdMatch && (method === "PUT" || method === "DELETE")) {
    const id = Number(classIdMatch[1]);
    const classes = await readClasses(store);
    const index = classes.findIndex((cls) => cls.id === id);

    if (index === -1) {
      return jsonResponse({ message: "Khong tim thay lop." }, 404);
    }

    if (method === "DELETE") {
      const removed = classes.splice(index, 1)[0];
      await writeClasses(store, classes);
      return jsonResponse(removed);
    }

    const body = await parseJsonBody(req);
    const { code, subject, requirement, schedule, salary, address, status } =
      body || {};

    if (!code || !subject || !requirement || !schedule || !salary || !address) {
      return jsonResponse(
        { message: "Thieu thong tin lop hoc bat buoc." },
        400
      );
    }

    const updated = {
      ...classes[index],
      code,
      subject,
      requirement,
      schedule,
      salary,
      address,
      status: typeof status === "boolean" ? status : classes[index].status
    };

    classes[index] = updated;
    await writeClasses(store, classes);
    return jsonResponse(updated);
  }

  const classStatusMatch = path.match(/^\/classes\/(\d+)\/status$/);
  if (classStatusMatch && method === "PATCH") {
    const id = Number(classStatusMatch[1]);
    const body = await parseJsonBody(req);
    const { status } = body || {};

    if (typeof status !== "boolean") {
      return jsonResponse({ message: "Gia tri status khong hop le." }, 400);
    }

    const classes = await readClasses(store);
    const index = classes.findIndex((cls) => cls.id === id);

    if (index === -1) {
      return jsonResponse({ message: "Khong tim thay lop." }, 404);
    }

    classes[index] = { ...classes[index], status };
    await writeClasses(store, classes);
    return jsonResponse(classes[index]);
  }

  if (path === "/auth/register" && method === "POST") {
    const body = await parseJsonBody(req);
    const { email, password, fullName, phone, subjects, area, note } = body || {};

    if (!email || !password || !fullName) {
      return jsonResponse(
        { message: "Vui long dien day du thong tin bat buoc" },
        400
      );
    }

    const users = await readUsers(store);

    if (users.find((user) => user.email === email)) {
      return jsonResponse({ message: "Email da ton tai" }, 400);
    }

    const newUser: UserRecord = {
      email,
      password,
      fullName,
      phone: phone || "",
      subjects: subjects || "",
      area: area || "",
      note: note || "",
      registeredClasses: []
    };

    users.push(newUser);
    await writeUsers(store, users);
    return jsonResponse({ message: "Dang ky thanh cong" });
  }

  if (path === "/auth/login" && method === "POST") {
    const body = await parseJsonBody(req);
    const { email, password } = body || {};

    if (!email || !password) {
      return jsonResponse({ message: "Vui long nhap email va mat khau" }, 400);
    }

    const ADMIN_EMAIL = "admin@admin.com";
    const ADMIN_PASSWORD = "123456";

    if ((email === ADMIN_EMAIL || email === "admin") && password === ADMIN_PASSWORD) {
      return jsonResponse({
        message: "Dang nhap thanh cong",
        user: {
          email: ADMIN_EMAIL,
          fullName: "Administrator",
          role: "admin"
        }
      });
    }

    const users = await readUsers(store);
    const user = users.find(
      (candidate) => candidate.email === email && candidate.password === password
    );

    if (!user) {
      return jsonResponse({ message: "Sai tai khoan hoac mat khau" }, 401);
    }

    if (!user.registeredClasses) {
      user.registeredClasses = [];
    }

    if (!user.role) {
      user.role = "user";
    }

    return jsonResponse({ message: "Dang nhap thanh cong", user });
  }

  if (path === "/auth/save-class" && method === "POST") {
    const body = await parseJsonBody(req);
    const { email, classCode } = body || {};

    if (!email || !classCode) {
      return jsonResponse({ message: "Thieu thong tin email hoac ma lop" }, 400);
    }

    const users = await readUsers(store);
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      return jsonResponse({ message: "Khong tim thay nguoi dung" }, 404);
    }

    if (!Array.isArray(users[userIndex].registeredClasses)) {
      users[userIndex].registeredClasses = [];
    }

    if (!users[userIndex].registeredClasses.includes(classCode)) {
      users[userIndex].registeredClasses.push(classCode);
      await writeUsers(store, users);
    }

    return jsonResponse({
      message: "Da luu ma lop vao tai khoan",
      user: users[userIndex]
    });
  }

  if (path === "/register" && method === "POST") {
    const body = await parseJsonBody(req);
    const { fullName, subjects, phone, email, note } = body || {};

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSebmZHYjVLDeUKUfMici_M9o9-wZVhebo5BrH4Fk2ZIkEeCRw/formResponse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            "entry.700107921": fullName || "",
            "entry.1684938228": subjects || "",
            "entry.955170913": phone || "",
            "entry.1436919814": email || "Khach chua dang nhap",
            "entry.695481864": note || ""
          })
        }
      );

      return jsonResponse({ message: "Dang ky nhan lop thanh cong!" });
    } catch (error) {
      console.error("Error sending to Google Form:", error);
      return jsonResponse({ message: "Khong gui duoc du lieu" }, 500);
    }
  }

  return jsonResponse({ message: "Not found" }, 404);
};

export const config: Config = {
  path: "/api/*"
};
