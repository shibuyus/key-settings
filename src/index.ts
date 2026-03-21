import {
  map,
  rule,
  writeToProfile,
  ifVar,
  withCondition,
  toSetVar,
} from 'karabiner.ts'

// ============================================================
// ベースレイヤー: 親指キーの設定
// ============================================================
function baseLayerRules() {
  return rule('Base layer - thumb keys').manipulators([
    // Cmd左: tap=英数, hold=Cmd
    map('left_command')
      .toIfAlone('japanese_eisuu')
      .to('left_command'),

    // Cmd右: tap=かな, hold=Cmd
    map('right_command')
      .toIfAlone('japanese_kana')
      .to('right_command'),
  ])
}

// ============================================================
// レイヤー1: 英数長押し → 記号
// layer() だと元のIME切替が発火するため、手動実装
// ============================================================
function symbolLayer() {
  const v = 'symbol-layer'

  return rule('Symbol layer - eisuu hold').manipulators([
    // 英数キー: 長押し=レイヤー1 ON、離す=OFF、タップ=Backspace
    map('japanese_eisuu')
      .toVar(v, 1)
      .toAfterKeyUp(toSetVar(v, 0))
      .toIfAlone('delete_or_backspace'),

    ...withCondition(ifVar(v, 1))([
      // 上段
      map('q').to('3', ['left_shift']),           // #
      map('w').to('hyphen', ['left_shift']),       // _
      map('e').to('equal_sign', ['left_shift']),   // +
      map('r').to('8', ['left_shift']),            // *
      map('t').to('2', ['left_shift']),            // @

      map('y').to('7', ['left_shift']),            // &
      map('u').to('1', ['left_shift']),            // !
      map('i').to('hyphen'),                        // -
      map('o').to('slash'),                         // /
      map('p').to('6', ['left_shift']),            // ^

      // ホームロウ: 左=開く、右=閉じる
      map('a').to('9', ['left_shift']),            // (
      map('s').to('open_bracket', ['left_shift']), // {
      map('d').to('open_bracket'),                  // [
      map('f').to('equal_sign'),                    // =
      map('g').to('comma', ['left_shift']),         // <

      map('h').to('period', ['left_shift']),        // >
      map('j').to('quote'),                         // '
      map('k').to('close_bracket'),                 // ]
      map('l').to('close_bracket', ['left_shift']),// }
      map('semicolon').to('0', ['left_shift']),    // )

      // 下段
      map('z').to('4', ['left_shift']),            // $
      map('x').to('5', ['left_shift']),            // %
      map('c').to('grave_accent_and_tilde', ['left_shift']), // ~
      map('v').to('backslash', ['left_shift']),    // |
      map('b').to('grave_accent_and_tilde'),        // `

      map('n').to('semicolon', ['left_shift']),       // :
      map('m').to('quote', ['left_shift']),         // "
      map('comma').to('semicolon'),                 // ;
      map('period').to('backslash'),                // \
    ]),
  ])
}

// ============================================================
// レイヤー2: かな長押し → 数字・ナビ
// ============================================================
function navNumLayer() {
  const v = 'nav-num-layer'

  return rule('Nav/Num layer - kana hold').manipulators([
    // かなキー: 長押し=レイヤー2 ON、離す=OFF、タップ=Enter
    map('japanese_kana', null, 'any')
      .toVar(v, 1)
      .toAfterKeyUp(toSetVar(v, 0))
      .toIfAlone('return_or_enter'),

    ...withCondition(ifVar(v, 1))([
      // 上段: 数字 1-0
      map('q').to('1'),
      map('w').to('2'),
      map('e').to('3'),
      map('r').to('4'),
      map('t').to('5'),
      map('y').to('6'),
      map('u').to('7'),
      map('i').to('8'),
      map('o').to('9'),
      map('p').to('0'),

      // ホームロウ左: Modifier
      map('a').to('left_shift'),
      map('s').to('left_control'),
      map('d').to('left_option'),
      map('f').to('left_command'),

      // ホームロウ右: ナビ (vim風)
      map('h').to('left_arrow'),
      map('j').to('down_arrow'),
      map('k').to('up_arrow'),
      map('l').to('right_arrow'),
      map('semicolon').to('delete_or_backspace'),

      // 下段右: ページナビ
      map('n').to('home'),
      map('m').to('page_down'),
      map('comma').to('page_up'),
      map('period').to('end'),
      map('slash').to('delete_forward'),
    ]),
  ])
}

// ============================================================
// レイヤー3: Opt左長押し → Fキー・スクショ
// ============================================================
function fnLayer() {
  const v = 'fn-layer'

  return rule('Fn layer - left_option hold').manipulators([
    // Opt左: 長押し=レイヤー3 ON、離す=OFF
    map('left_option')
      .toVar(v, 1)
      .toAfterKeyUp(toSetVar(v, 0))
      .toIfAlone('left_option'),

    ...withCondition(ifVar(v, 1))([
      // 上段: F1-F5, F6-F10
      map('q').to('f1'),
      map('w').to('f2'),
      map('e').to('f3'),
      map('r').to('f4'),
      map('t').to('f5'),
      map('y').to('f6'),
      map('u').to('f7'),
      map('i').to('f8'),
      map('o').to('f9'),
      map('p').to('f10'),

      // ホームロウ左: Modifier
      map('a').to('left_shift'),
      map('s').to('left_control'),
      map('d').to('left_option'),
      map('f').to('left_command'),

      // ホームロウ右: F11, F12, スクショ
      map('g').to('f11'),
      map('h').to('f12'),
      map('j').to('1', ['left_command', 'left_shift']),  // SS1: 全画面
      map('k').to('2', ['left_command', 'left_shift']),  // SS2: 範囲
      map('l').to('5', ['left_command', 'left_shift']),  // SS5: スクロール
    ]),
  ])
}

// ============================================================
// プロファイルに書き出し
// Karabiner-Elements のメニューバーから 'Default profile' に戻せば元通り
// ============================================================
writeToProfile('39key-layer', [
  baseLayerRules(),
  symbolLayer(),
  navNumLayer(),
  fnLayer(),
])
