"use client";
import Profile from "@/components/Profile";
import Card from "@/components/Card";
import { useState } from "react";

export default function Home() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
    await fetch("/api/user/update", {
        method: "POST",
        body: JSON.stringify({ id: Number(id), name }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl">更新用户信息</h1>
      <input
        placeholder="用户ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="border p-2 m-2"
      />
      <input
        placeholder="新名字"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 m-2"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">
        更新
      </button>
      <Profile />
      <Card header={<h2>工作经历</h2>} footer={<h1>显示更多</h1>}>
        <h1>智谱AI</h1>
      </Card>
      <Card header={<h2>教育经历</h2>} footer={<h1>显示更多</h1>}>
        <h1>QiLu University</h1>
      </Card>
      <Card header={<h2>技能</h2>} footer={<h1>显示更多</h1>}>
        <h1>JavaScript</h1>
      </Card>
    </div>
  );
}
