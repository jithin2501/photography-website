'use client';

import React from 'react';
import '../css/MessageSection.css';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface MessageSectionProps {
  messages: ContactMessage[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDeleteMessage: (id: string) => void;
}

export default function MessageSection({
  messages,
  loading,
  searchQuery,
  onSearchChange,
  onDeleteMessage,
}: MessageSectionProps) {
  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(searchLower) ||
      msg.email.toLowerCase().includes(searchLower) ||
      msg.subject.toLowerCase().includes(searchLower) ||
      msg.message.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {/* Controls Row */}
      <section className="controlsRow">
        <h2 className="sectionTitle">Contact Messages</h2>
        <div className="searchWrapper">
          <span className="searchIcon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search messages..."
            className="searchInput"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </section>

      {/* Messages List */}
      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="emptyState">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h3>No messages found</h3>
          <p>{searchQuery ? 'Try matching another search term.' : 'When users submit contact forms, they will show up here.'}</p>
        </div>
      ) : (
        <div className="messagesGrid">
          {filteredMessages.map((msg) => (
            <article key={msg._id} className="messageCard">
              <div className="cardHeader">
                <div className="senderInfo">
                  <h4>{msg.name}</h4>
                  <div className="senderMeta">
                    <div className="metaItem">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </div>
                    {msg.phone && (
                      <div className="metaItem">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                      </div>
                    )}
                  </div>
                </div>
                <span className="timestamp">{formatDate(msg.createdAt)}</span>
              </div>
              <div className="subjectBadge">{msg.subject}</div>
              <p className="messageText">{msg.message}</p>
              <div className="cardActions">
                <button className="deleteBtn" onClick={() => onDeleteMessage(msg._id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
