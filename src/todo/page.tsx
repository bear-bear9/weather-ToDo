import React, { useState, useEffect } from 'react';
import { Todo, FilterType } from './types';
// import TodoHeader from './header';
import TodoItem from './item';
import { TodoForm } from './todoform';
import TodoFilter from './todofilter';
import './layout.css'
import WeatherPage from '../weather/page';

export default function TodoPage() {

  // ランダムで画面上部にポケモンを表示
  // 動的文字列生成の勉強かつ配列処理の応用
  // 修正：PokeAPIを使うことによりAPU呼び出しの応用に変更
  const [luckyPokemon, setLuckyPokemon] = useState("");
  const [luckyPokemonId, setLuckyPokemonId] = useState<number>(0);

  const fetchPokemon = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
      const data = await response.json();

      // 日本語（漢字・ひらがな両方）を探すロジックを強化
      const nameObj = data.names.find((n: any) =>
        n.language.name === "ja-Hrkt" || n.language.name === "ja"
      );

      // 日本語名がなければ、英語名（name）を代わりに出す
      const finalName = nameObj ? nameObj.name : data.name;

      setLuckyPokemonId(randomId);
      setLuckyPokemon(`現在のラッキーポケモンは？ ：${finalName}！`);
    } catch (error) {
      console.error("ポケモンが見つかりません:", error);
      setLuckyPokemon("今日のラッキーポケモン：ピカチュウ†");
    }
  };

  const goToPokedex = () => {
    if (luckyPokemonId === 0) return;

    // ポケモン公式図鑑のURL（IDで直接飛べます）
    // 3桁（001形式）にするための整形
    const pokedexNo = String(luckyPokemonId).padStart(3, '0');
    const url = `https://zukan.pokemon.co.jp/detail/${pokedexNo}`;

    // セキュリティ（noopener noreferrer）を確保しつつ別タブで開く
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 3. 画面表示時に実行
  useEffect(() => {
    fetchPokemon();
  }, []);

  // ローカルストレージ化
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<FilterType>('all');

  // バグ発生個所
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    // 依存配列により変化を監視
  }, [todos]);

  // TODOの完了状態を反転させる
  const toggleTodo = (id: any) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos([...updated]);
  };

  // TODO追加メソッド
  // バグ発生個所：ローカルストレージ対応後、TODOを追加しても総数が増えない
  // リロードすると正常の値になるため非同期動作を確認
  const addTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  // 削除ボタンが押された時の処理
  const deleteTodo = (id: number) => {
    // filterを使って「クリックされたID以外」を残す = 削除
    const newTodos = todos.filter(t => t.id !== id);
    setTodos([...newTodos]);
  };

  // 全てのTODOを完了にする
  const completeAllTodos = () => {
    if (window.confirm("全てのタスクを完了にしてもよろしいですか？")) {
      const updated = todos.map(todo => ({ ...todo, completed: true }));
      setTodos(updated);
    }
  };

  // 全てのTODOを削除する
  const deleteAllTodos = () => {
    if (window.confirm("全てのタスクを削除します。よろしいですか？")) {
      setTodos([]);
    }
  };

  // 保存ボタンが押された時の処理
  // バグ発生個所：保存時にstateが更新されず、編集内容が反映されなかった
  // 編集ボタンを押した瞬間にsetEditText(text)を実行して、最新の文字を同期させるようにしました。
  const editTodo = (id: number, newText: string) => {
    setTodos(prev => [...prev.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    )]);
  };

  // フィルタリングされたTODOリスト
  const todoFiltermethod = todos.filter((todo: Todo) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="fenrir-power" onClick={goToPokedex} style={{ cursor: 'pointer' }}>
        {luckyPokemon}
        <div style={{
          fontSize: '0.75rem',
          opacity: 0.8,
          marginTop: '4px',
          fontWeight: 'normal'
        }}>
          タップして図鑑を見る！ (※公式サイトに移動します)
        </div>
      </div>

      {/* 天気を表示 */}
      <WeatherPage
        key="weather-stable"
        totalCount={todos.length}
        uncompletedCount={todos.filter(t => !t.completed).length}
      />
      {/* バグ発生個所：動的キーにしないとヘッダーのカウントがリアルタイムで更新できなかった */}

      {/* ヘッダーとフォームが似ているつくりのため不要→コメントアウト */}

      {/* <TodoHeader
      key={`header-${todos.length}-${todos.filter(t => t.completed).length}`}
      title="ToDo with 天気"
      totalCount={todos.length}
      completedCount={todos.filter(t => t.completed).length}
      activeCount={todos.length - todos.filter(t => t.completed).length}
    /> 
    */}

      <TodoForm onAddTodo={addTodo} />
      {/* バグ発生個所：動的キーにしないとヘッダーのカウントがリアルタイムで更新できなかった */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap', // スマホで入り切らない時に自動で折り返す
        gap: '10px'
      }}>
        <TodoFilter
          key={`filter-${todos.length}-${todos.filter(t => t.completed).length}`}
          totalCount={todos.length}
          activeCount={todos.length - todos.filter(t => t.completed).length}
          completedCount={todos.filter(t => t.completed).length}
          filter={filter}
          onFilterChange={setFilter}
        />
        <div className="bulk-actions" style={{ display: 'flex', gap: '8px' }}>
          <button onClick={completeAllTodos} className="btn-small">全完了</button>
          <button onClick={deleteAllTodos} className="btn-small-danger">全削除</button>
        </div>
      </div>
      <div className="todo-list">
        {todoFiltermethod.map(todo => (
          <TodoItem key={todo.id} {...todo} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
        ))}
      </div>
    </div>
  );
}