import { CONTACT } from "../constants";
import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Portfolio Contact Form");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:zohaib.s.cheema92@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="border-b border-neutral-900 pb-32 pt-28 px-4"
    >
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center text-4xl font-bold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        Get in Touch
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto flex flex-col gap-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={handleChange}
          className="bg-neutral-900/40 text-white rounded-lg px-4 py-3 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={handleChange}
          className="bg-neutral-900/40 text-white rounded-lg px-4 py-3 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="bg-neutral-900/40 text-white rounded-lg px-4 py-3 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
        <button
          type="submit"
          className="self-center mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Send Message
        </button>
      </form>

      {/* Optional Static Info */}
      <div className="text-center mt-16 tracking-tighter text-neutral-400">
        <p className="my-2">{CONTACT.address}</p>
        <p className="my-2">{CONTACT.phoneNo}</p>
        <a
          href={`mailto:${CONTACT.email}`}
          className="text-purple-400 hover:underline"
        >
          {CONTACT.email}
        </a>
      </div>
    </section>
  );
};

export default Contact;
