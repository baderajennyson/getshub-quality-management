--
-- PostgreSQL database dump
--

\restrict OvrEbRBqmiSOpKtgZt2ZKvYJwxaRaNY6ppUcmKwHCIkeTDzFWWE1JwRGaKbgvqd

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: provisions; Type: TABLE; Schema: public; Owner: getshub_user
--

CREATE TABLE public.provisions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "requestNumber" character varying NOT NULL,
    "customerName" character varying NOT NULL,
    "customerAddress" character varying NOT NULL,
    "contactNumber" character varying NOT NULL,
    email character varying,
    "provisionType" public.provisions_provisiontype_enum DEFAULT 'NEW_CONNECTION'::public.provisions_provisiontype_enum NOT NULL,
    status public.provisions_status_enum DEFAULT 'PENDING_ASSIGNMENT'::public.provisions_status_enum NOT NULL,
    "estimatedCost" numeric(10,2),
    description text,
    "technicalRequirements" text,
    "requestedCompletionDate" date,
    "actualCompletionDate" date,
    "assignedAuditorId" uuid,
    "uploadedById" uuid,
    "auditNotes" text,
    "auditPhotos" text,
    "qualityScore" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.provisions OWNER TO getshub_user;

--
-- Data for Name: provisions; Type: TABLE DATA; Schema: public; Owner: getshub_user
--

COPY public.provisions (id, "requestNumber", "customerName", "customerAddress", "contactNumber", email, "provisionType", status, "estimatedCost", description, "technicalRequirements", "requestedCompletionDate", "actualCompletionDate", "assignedAuditorId", "uploadedById", "auditNotes", "auditPhotos", "qualityScore", "createdAt", "updatedAt") FROM stdin;
358cdccf-6168-4ad3-baa1-9ab0b9124f6f	REQ-202509000001	Jennyson	Customer asdf a sdf	099765478	baderajennyson@gmail.com	NEW_CONNECTION	PENDING_ASSIGNMENT	12.00	asdfasdf	asdfasdfasdf	\N	\N	\N	cb279d27-d89e-465f-bd75-3de431435124	\N	\N	\N	2025-09-11 05:25:08.122966	2025-09-11 05:25:08.122966
\.


--
-- Name: provisions PK_6ec9c596e6052e5f311248bbf3c; Type: CONSTRAINT; Schema: public; Owner: getshub_user
--

ALTER TABLE ONLY public.provisions
    ADD CONSTRAINT "PK_6ec9c596e6052e5f311248bbf3c" PRIMARY KEY (id);


--
-- Name: provisions UQ_01f6efbec91b935eebc9669a3f7; Type: CONSTRAINT; Schema: public; Owner: getshub_user
--

ALTER TABLE ONLY public.provisions
    ADD CONSTRAINT "UQ_01f6efbec91b935eebc9669a3f7" UNIQUE ("requestNumber");


--
-- Name: provisions FK_1b424985f70960d6a6959027e9e; Type: FK CONSTRAINT; Schema: public; Owner: getshub_user
--

ALTER TABLE ONLY public.provisions
    ADD CONSTRAINT "FK_1b424985f70960d6a6959027e9e" FOREIGN KEY ("assignedAuditorId") REFERENCES public.users(id);


--
-- Name: provisions FK_5414ef89706165da39a5c2c3934; Type: FK CONSTRAINT; Schema: public; Owner: getshub_user
--

ALTER TABLE ONLY public.provisions
    ADD CONSTRAINT "FK_5414ef89706165da39a5c2c3934" FOREIGN KEY ("uploadedById") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict OvrEbRBqmiSOpKtgZt2ZKvYJwxaRaNY6ppUcmKwHCIkeTDzFWWE1JwRGaKbgvqd

