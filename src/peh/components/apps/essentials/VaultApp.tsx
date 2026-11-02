import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { VaultItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const VaultApp: React.FC = () => {
  const { vaultItems, addVaultItem, deleteVaultItem, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('Semua');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<VaultItem['type']>('Login / Akun');
  const [identifier, setIdentifier] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Password Generator states
  const [genLength, setGenLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNums, setIncludeNums] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');

  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNums) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let res = '';
    const array = new Uint32Array(genLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < genLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedPass(res);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !secretValue.trim()) return;

    addVaultItem({
      title: title.trim(),
      type,
      identifier: identifier.trim(),
      secretValue: secretValue.trim(),
      serviceUrl: serviceUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setIdentifier('');
    setSecretValue('');
    setServiceUrl('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredItems = vaultItems.filter((item) => {
    if (filterType === 'Semua') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="KeyRound" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Brankas Sandi & Kunci
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Penyimpanan aman kredensial, kunci API, PIN kartu, dan catatan sensitif secara lokal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="Plus" size={14} />
          <span>Simpan Kredensial Baru</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'all-keys', label: 'Kredensial Tersimpan', count: vaultItems.length },
            { id: 'generator', label: 'Generator Sandi' },
            { id: 'security-audit', label: 'Audit Keamanan' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'all-keys');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubMenu(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Jenis</option>
            <option value="Login / Akun">Login / Akun</option>
            <option value="Kunci API / Token">Kunci API / Token</option>
            <option value="PIN & Sandi Kartu">PIN & Sandi Kartu</option>
            <option value="Catatan Rahasia">Catatan Rahasia</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {vaultItems.length === 0 && activeSubMenu !== 'generator' ? (
        <EmptyState
          iconName="KeyRound"
          title="Brankas masih kosong"
          description="Simpan kredensial akun, kode cadangan autentikasi, atau kunci rahasia Anda dengan aman di browser lokal Anda."
          actionLabel="Simpan Kredensial Pertama"
          onAction={() => setIsAddModalOpen(true)}
          secondaryLabel="Buka Generator Sandi"
          onSecondaryAction={() => {
            setActiveSubMenu('generator');
            generatePassword();
          }}
        />
      ) : (
        <>
          {/* All Keys List */}
          {(activeSubMenu === 'all-keys' || !activeSubMenu) && (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isRevealed = revealedIds[item.id];
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-neutral-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-sm">{item.title}</span>
                      </div>
                      {/* Zero-pill metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <span>{item.type}</span>
                        {item.identifier && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-neutral-700">{item.identifier}</span>
                          </>
                        )}
                        {item.serviceUrl && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[150px]">{item.serviceUrl}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Secret preview box */}
                      <div className="px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-mono text-neutral-800 tracking-wider">
                        {isRevealed ? item.secretValue : '••••••••••••'}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleReveal(item.id)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        title={isRevealed ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        <Icon name={isRevealed ? 'EyeOff' : 'Eye'} size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.secretValue)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Salin ke papan klip"
                      >
                        <Icon name={isCopied ? 'Check' : 'Copy'} size={15} className={isCopied ? 'text-emerald-600' : ''} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteVaultItem(item.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Password Generator */}
          {activeSubMenu === 'generator' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Generator Sandi Kriptografis</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Hasilkan kata sandi acak dengan standar entropi tinggi langsung di browser Anda.
                </p>
              </div>

              {/* Password Result Box */}
              <div className="flex items-center gap-2 p-3 bg-neutral-100 rounded-xl border border-neutral-200">
                <input
                  type="text"
                  readOnly
                  value={generatedPass || 'Klik tombol di bawah untuk membuat sandi'}
                  className="w-full bg-transparent font-mono text-sm text-neutral-900 focus:outline-hidden"
                />
                {generatedPass && (
                  <button
                    onClick={() => handleCopy('gen', generatedPass)}
                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
                    title="Salin"
                  >
                    <Icon name={copiedId === 'gen' ? 'Check' : 'Copy'} size={16} />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-700 mb-1.5">
                    <span>Panjang Karakter</span>
                    <span className="font-mono tabular-nums">{genLength} karakter</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    value={genLength}
                    onChange={(e) => setGenLength(Number(e.target.value))}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeUpper}
                      onChange={(e) => setIncludeUpper(e.target.checked)}
                      className="rounded accent-neutral-900"
                    />
                    <span>Huruf Besar</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNums}
                      onChange={(e) => setIncludeNums(e.target.checked)}
                      className="rounded accent-neutral-900"
                    />
                    <span>Angka (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="rounded accent-neutral-900"
                    />
                    <span>Simbol (!@#)</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <Icon name="RefreshCw" size={14} />
                    <span>Buat Sandi Baru</span>
                  </button>

                  {generatedPass && (
                    <button
                      type="button"
                      onClick={() => {
                        setSecretValue(generatedPass);
                        setIsAddModalOpen(true);
                      }}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Gunakan & Simpan ke Brankas
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Audit */}
          {activeSubMenu === 'security-audit' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Audit Kesehatan Kredensial</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Pemeriksaan integritas keamanan berdasarkan data nyata di brankas Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <div className="text-xs text-neutral-500">Total Kredensial</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    {vaultItems.length}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <div className="text-xs text-neutral-500">Sandi Pendek (&lt; 10 Karakter)</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    {vaultItems.filter((v) => v.secretValue.length < 10).length}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <div className="text-xs text-neutral-500">Sandi Kuat (&ge; 14 Karakter)</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    {vaultItems.filter((v) => v.secretValue.length >= 14).length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Credential Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Simpan Kredensial ke Brankas"
        subtitle="Data disimpan secara lokal di peramban Anda."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Akun / Layanan *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Portal Kantor, Router Wi-Fi, Akun GitHub"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tipe Kredensial</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Login / Akun">Login / Akun</option>
                <option value="Kunci API / Token">Kunci API / Token</option>
                <option value="PIN & Sandi Kartu">PIN & Sandi Kartu</option>
                <option value="Catatan Rahasia">Catatan Rahasia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Username / ID</label>
              <input
                type="text"
                placeholder="admin / surel@mail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-700">Sandi / Nilai Kunci *</label>
              <button
                type="button"
                onClick={() => {
                  generatePassword();
                  if (generatedPass) setSecretValue(generatedPass);
                }}
                className="text-[11px] text-neutral-600 hover:text-neutral-900 underline"
              >
                Hasilkan Sandi Acak
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="Ketik kata sandi atau kunci..."
              value={secretValue}
              onChange={(e) => setSecretValue(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Alamat Web / URL (Opsional)</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={serviceUrl}
              onChange={(e) => setServiceUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Kredensial
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
