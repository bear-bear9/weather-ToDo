import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Collapse, Divider } from '@mui/material';
import { ChevronRight, ChevronDown, Home } from 'lucide-react';
import { SidebarProps } from './types';
import { regionTree } from './regionTree';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onCitySelect }) => {
    // 開閉状態の管理（どの地方、どの県が開いているか）
    const [openRegion, setOpenRegion] = useState<string | null>(null);
    const [openPref, setOpenPref] = useState<string | null>(null);

    const [favorites, setFavorites] = useState<string[]>([]);

    const navigate = useNavigate();

    const toggleRegion = (region: string) => {
        setOpenRegion(openRegion === region ? null : region);
        setOpenPref(null); // 地方を閉じたら県もリセット
    };

    const togglePref = (pref: string) => {
        setOpenPref(openPref === pref ? null : pref);
    };

    useEffect(() => {
        if (isOpen) {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            setFavorites(favs);
        }
    }, [isOpen]);

    return (
        <Drawer anchor="left" open={isOpen} onClose={onClose}>
            <div style={{ width: 280, paddingTop: '10px' }}>
                <h3 style={{ paddingLeft: '20px', color: '#546e7a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    メニュー
                </h3>
                <Divider />
                <List>
                    {/* ホームボタン */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => {
                            onClose();      // サイドバーを閉じる
                            navigate("/");  // 🌟 ホーム画面に遷移する
                        }}>
                            <Home size={20} style={{ marginRight: '10px', color: '#546e7a' }} />
                            <ListItemText primary="ホーム" />
                        </ListItemButton>
                    </ListItem>

                    <Divider />

                    {favorites.length > 0 && (
                        <>
                            <div style={{ padding: '12px 16px 4px 16px', fontSize: '0.75rem', color: '#ffa000', fontWeight: 'bold' }}>
                                ⭐ よく見る地域
                            </div>
                            {favorites.map(city => (
                                <ListItem key={city} disablePadding>
                                    <ListItemButton onClick={() => {
                                        onCitySelect(city);
                                        navigate(`/detail/${city}`); // 直接詳細へ
                                        onClose();
                                    }}>
                                        <ListItemText
                                            primary={city}
                                            primaryTypographyProps={{ fontWeight: 'bold', color: '#333' }}
                                        />
                                        <ChevronRight size={14} style={{ color: '#cfd8dc' }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                            <Divider sx={{ my: 1 }} />
                        </>
                    )}

                    {/* 1層目：地方 */}
                    {regionTree.map((r) => (
                        <React.Fragment key={r.region}>
                            <ListItemButton onClick={() => toggleRegion(r.region)}>
                                <ListItemText primary={r.region} />
                                {openRegion === r.region ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </ListItemButton>

                            <Collapse in={openRegion === r.region} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding style={{ backgroundColor: '#f9f9f9' }}>
                                    {/* 2層目：県 */}
                                    {r.prefs.map((p) => (
                                        <React.Fragment key={p.name}>
                                            <ListItemButton sx={{ pl: 4 }} onClick={() => togglePref(p.name)}>
                                                <ListItemText primary={p.name} />
                                                {openPref === p.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </ListItemButton>

                                            <Collapse in={openPref === p.name} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {/* 3層目：市 */}
                                                    {p.cities.map((city) => (
                                                        <ListItemButton
                                                            key={city}
                                                            sx={{
                                                                pl: 8,
                                                                py: 0.5,
                                                                // タップ時にハイライト
                                                                '&:hover': { backgroundColor: '#e3f2fd' }
                                                            }}
                                                            onClick={() => {
                                                                onClose();
                                                                onCitySelect(city);
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={city}
                                                                // 文字を少し小さく、色を落ち着かせる
                                                                primaryTypographyProps={{ fontSize: '0.9rem', color: '#455a64' }}
                                                                secondary="詳細予報へ"
                                                                secondaryTypographyProps={{ fontSize: '0.65rem' }}
                                                            />
                                                            {/* 遷移を暗示する小さなアイコン */}
                                                            <ChevronRight size={14} style={{ color: '#cfd8dc' }} />
                                                        </ListItemButton>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;